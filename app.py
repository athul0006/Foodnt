import sqlite3
import random
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="Foodn't Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("foodnt.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            original_item TEXT,
            mutated_item TEXT,
            original_price REAL,
            final_price REAL,
            eta_minutes INTEGER,
            efficiency_score REAL,
            status TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Serve index.html directly on http://127.0.0.1:8000
@app.get("/")
def serve_frontend():
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    if os.path.exists(frontend_path):
        return FileResponse(frontend_path)
    return {"error": "index.html not found in frontend folder"}

class AuthData(BaseModel):
    email: str
    password: str

class OrderCreate(BaseModel):
    user_id: int
    item_name: str
    base_price: float
    offer_applied: bool
    promo_price: float = 0.0

@app.post("/api/auth/register")
def register(data: AuthData):
    try:
        conn = sqlite3.connect("foodnt.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (data.email, data.password))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"status": "success", "user_id": user_id, "email": data.email}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/api/auth/login")
def login(data: AuthData):
    conn = sqlite3.connect("foodnt.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email=? AND password=?", (data.email, data.password))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"status": "success", "user_id": row[0], "email": data.email}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/signup")
def signup(data: AuthData):
    return register(data)

MENU_CATALOG = [
    {
        "id": 1,
        "name": "Truffle Mushroom Burger",
        "category": "Burgers & Mains",
        "description": "Double smash patty, black truffle emulsion, sautéed cremini, aged gruyère on toasted brioche.",
        "base_price": 249.0,
        "offer_price": 149.0,
        "has_offer": True,
        "expire_seconds": 15,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 2,
        "name": "Wood-fired Margherita Pizza",
        "category": "Artisanal Pizzas",
        "description": "San Marzano tomato coulis, fresh fior di latte mozzarella, fragrant sweet basil, cold-pressed olive oil.",
        "base_price": 399.0,
        "offer_price": 219.0,
        "has_offer": True,
        "expire_seconds": 22,
        "image": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 3,
        "name": "Slow-cooked Hyderabadi Biryani",
        "category": "Rice Specialties",
        "description": "Fragrant long-grain aged basmati layered with saffron broth, caramelized onions, and slow-braised spices.",
        "base_price": 280.0,
        "offer_price": 180.0,
        "has_offer": True,
        "expire_seconds": 18,
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 4,
        "name": "Artisanal Matcha Latte",
        "category": "Beverages",
        "description": "First-harvest ceremonial Uji matcha whisked with silky micro-foamed oat milk and subtle Madagascar vanilla.",
        "base_price": 190.0,
        "offer_price": 99.0,
        "has_offer": True,
        "expire_seconds": 25,
        "image": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"
    }
]

@app.get("/api/menu")
def get_menu():
    return MENU_CATALOG

MUTATION_TABLE = {
    "Truffle Mushroom Burger": "Classic Chicken Burger",
    "Wood-fired Margherita Pizza": "Four Cheese Pizza",
    "Slow-cooked Hyderabadi Biryani": "Kerala Chicken Biryani",
    "Artisanal Matcha Latte": "Vanilla Cold Coffee"
}

DETERMINISTIC_TELEMETRY_SEQUENCE = [
    {"eta": 14, "status": "Driver assigned. Moving toward restaurant.", "deviation": "+0%"},
    {"eta": 10, "status": "Driver approach detected. Approaching pickup node.", "deviation": "+18%"},
    {"eta": 17, "status": "Trajectory optimization: Off-route branch detected.", "deviation": "+45%"},
    {"eta": 28, "status": "Rerouting: Driver executed an unexpected U-turn.", "deviation": "+125%"},
    {"eta": 41, "status": "Optimization alert: Driver has crossed district lines.", "deviation": "+225%"},
    {"eta": 55, "status": "System warning: Delivery vector diverging exponentially.", "deviation": "+366%"},
    {"eta": 0,  "status": "Fulfillment completed. Significant operational variance detected.", "deviation": "+366%"}
]

order_telemetry_steps = {}

@app.post("/api/order/create")
def create_order(order: OrderCreate):
    conn = sqlite3.connect("foodnt.db")
    cursor = conn.cursor()

    catalog_match = next((item for item in MENU_CATALOG if item["name"] == order.item_name), None)
    default_promo = catalog_match["offer_price"] if catalog_match else 219.0
    promo_price = order.promo_price if order.promo_price > 0 else default_promo
    base_price = order.base_price
    final_price = base_price  # Promotional price fails and standard price is invoiced!
    price_variance = round(final_price - promo_price, 2)
    price_variance_pct = round((price_variance / promo_price) * 100) if promo_price > 0 else 82

    mutated_item = MUTATION_TABLE.get(order.item_name, order.item_name)
    initial_eta = 14
    final_eta = 55
    efficiency_score = 18.4
    order_integrity = "MODIFIED" if mutated_item != order.item_name else "NOMINAL"

    cursor.execute("""
        INSERT INTO orders 
        (user_id, original_item, mutated_item, original_price, final_price, eta_minutes, efficiency_score, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (order.user_id, order.item_name, mutated_item, base_price, final_price, initial_eta, efficiency_score, "In Transit"))
    
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()

    order_telemetry_steps[order_id] = 0

    return {
        "order_id": order_id,
        "original_item": order.item_name,
        "mutated_item": mutated_item,
        "base_price": base_price,
        "standard_price": base_price,
        "promo_price": promo_price,
        "final_price": final_price,
        "original_price": base_price,
        "price_variance": price_variance,
        "price_variance_pct": price_variance_pct,
        "offer_failed": True,
        "initial_eta": 14,
        "final_eta": 55,
        "eta_variance": "+41 min",
        "planned_km": 2.4,
        "actual_km": 7.8,
        "route_deviation": "+225%",
        "order_integrity": order_integrity,
        "eta_minutes": 14,
        "efficiency_score": 18.4,
        "status": "In Transit",
        "driver_distance_km": 2.4,
        "expired_offers_count": 1,
        "items": [
            {
                "name": order.item_name,
                "mutated_name": mutated_item,
                "price": final_price,
                "original_price": base_price,
                "promo_price": promo_price,
                "substituted": mutated_item != order.item_name
            }
        ]
    }

@app.get("/api/order/{order_id}/telemetry")
def get_telemetry(order_id: int):
    step = order_telemetry_steps.get(order_id, 0)
    selected_state = DETERMINISTIC_TELEMETRY_SEQUENCE[min(step, len(DETERMINISTIC_TELEMETRY_SEQUENCE) - 1)]
    order_telemetry_steps[order_id] = step + 1
    return {
        "order_id": order_id,
        "current_eta": selected_state["eta"],
        "telemetry_status": selected_state["status"],
        "deviation_index": selected_state["deviation"],
        "step_index": min(step, len(DETERMINISTIC_TELEMETRY_SEQUENCE) - 1)
    }

@app.get("/api/order/{order_id}")
def get_order(order_id: int):
    conn = sqlite3.connect("foodnt.db")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, user_id, original_item, mutated_item, original_price, final_price, eta_minutes, efficiency_score, status 
        FROM orders WHERE id = ?
    """, (order_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Order not found")
    
    is_substituted = row[3] != row[2]
    return {
        "order_id": row[0],
        "user_id": row[1],
        "original_item": row[2],
        "mutated_item": row[3],
        "original_price": row[4],
        "final_price": row[5],
        "eta_minutes": row[6],
        "efficiency_score": row[7],
        "status": row[8],
        "order_integrity": "MODIFIED" if is_substituted else "NOMINAL",
        "driver_distance_km": 4.6,
        "expired_offers_count": 1 if row[5] > row[4] else 0,
        "items": [
            {
                "name": row[2],
                "mutated_name": row[3],
                "price": row[5],
                "original_price": row[4],
                "substituted": is_substituted
            }
        ]
    }