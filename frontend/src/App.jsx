import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import LandingView from './views/LandingView.jsx';
import MenuView from './views/MenuView.jsx';
import CartSummary from './components/CartSummary.jsx';
import AuthView from './views/AuthView.jsx';
import TrackingDashboard from './views/TrackingDashboard.jsx';
import DeliveryRouteView from './views/DeliveryRouteView.jsx';
import { getFoodImage, MUTATION_MAP } from './constants/foodItems.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

const DEFAULT_MENU_FALLBACK = [
  {
    id: 1,
    name: "Truffle Mushroom Burger",
    category: "Burgers & Mains",
    description: "Double smash patty, black truffle emulsion, sautéed cremini, aged gruyère on brioche.",
    base_price: 249,
    offer_price: 149,
    has_offer: true,
    expire_seconds: 15,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Wood-fired Margherita Pizza",
    category: "Artisanal Pizzas",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil, cold-pressed olive oil.",
    base_price: 399,
    offer_price: 219,
    has_offer: true,
    expire_seconds: 22,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Slow-cooked Hyderabadi Biryani",
    category: "Rice Specialties",
    description: "Aged basmati rice, saffron dew, caramelized shallots, slow-braised spices in dum.",
    base_price: 280,
    offer_price: 180,
    has_offer: true,
    expire_seconds: 18,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Artisanal Matcha Latte",
    category: "Beverages",
    description: "First-harvest ceremonial Uji matcha, micro-foamed oat milk, touch of organic agave.",
    base_price: 190,
    offer_price: 99,
    has_offer: true,
    expire_seconds: 25,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"
  }
];

function formatApiError(data, status) {
  if (!data) return `Server returned ${status}.`;

  if (typeof data === 'string') return data;

  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg) {
          const location = Array.isArray(item.loc) ? item.loc.join('.') : '';
          return location ? `${location}: ${item.msg}` : item.msg;
        }
        return JSON.stringify(item);
      })
      .join('\n');
  }

  return JSON.stringify(data);
}

export default function App() {
  const [view, setView] = useState('landing');

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodnt_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState('');
  const [menu, setMenu] = useState(DEFAULT_MENU_FALLBACK);
  const [offerTimers, setOfferTimers] = useState({});
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('foodnt_active_order');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        const orig = parsed.original_item || parsed.items?.[0]?.name;
        if (orig && MUTATION_MAP[orig]) {
          parsed.mutated_item = MUTATION_MAP[orig];
        }
        parsed.original_image = parsed.original_image || getFoodImage(parsed.original_item);
        parsed.mutated_image = parsed.mutated_image || getFoodImage(parsed.mutated_item);
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [telemetryLogs, setTelemetryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('foodnt_telemetry_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch menu.
  useEffect(() => {
    fetch(`${API_BASE}/menu`)
      .then((res) => {
        if (!res.ok) throw new Error('Menu fetch failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenu(data);

          const timers = {};
          data.forEach((item) => {
            if (item.has_offer) {
              timers[item.id] = item.expire_seconds || 15;
            }
          });
          setOfferTimers(timers);
        }
      })
      .catch(() => {
        const timers = {};
        DEFAULT_MENU_FALLBACK.forEach((item) => {
          if (item.has_offer) timers[item.id] = item.expire_seconds;
        });
        setOfferTimers(timers);
      });
  }, []);

  // Flash offer countdown.
  useEffect(() => {
    const interval = setInterval(() => {
      setOfferTimers((prev) => {
        let changed = false;
        const next = { ...prev };

        Object.keys(next).forEach((id) => {
          if (next[id] > 0) {
            next[id] -= 1;
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Persistence.
  useEffect(() => {
    if (user) localStorage.setItem('foodnt_user', JSON.stringify(user));
    else localStorage.removeItem('foodnt_user');
  }, [user]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('foodnt_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('foodnt_active_order');
    }
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('foodnt_telemetry_logs', JSON.stringify(telemetryLogs));
  }, [telemetryLogs]);

  // Live deterministic telemetry.
  const fetchTelemetry = useCallback(async (orderId) => {
    if (!orderId) return;

    try {
      const res = await fetch(`${API_BASE}/order/${orderId}/telemetry`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(formatApiError(data, res.status));
      }

      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setActiveOrder((prev) => {
        if (!prev) return null;

        const isDelivered = data.current_eta === 0;

        return {
          ...prev,
          eta_minutes: data.current_eta,
          telemetry_status: data.telemetry_status,
          deviation_index: data.deviation_index,
          telemetry_step: data.step_index,
          status: isDelivered ? 'Delivered' : 'In Transit',
          delivered: isDelivered
        };
      });

      setTelemetryLogs((prev) => [
        {
          time: timeStr,
          status: data.telemetry_status,
          deviation: data.deviation_index
        },
        ...prev.slice(0, 15)
      ]);
    } catch (err) {
      console.warn('Telemetry polling skipped:', err);
    }
  }, []);

  useEffect(() => {
    if (view !== 'tracking' || !activeOrder?.order_id || activeOrder.delivered) {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchTelemetry(activeOrder.order_id);
    }, 3500);

    return () => clearInterval(interval);
  }, [view, activeOrder?.order_id, activeOrder?.delivered, fetchTelemetry]);

  const handleRecalibrate = async () => {
    if (!activeOrder?.order_id) return;

    setIsRecalibrating(true);

    try {
      await fetchTelemetry(activeOrder.order_id);
    } finally {
      setTimeout(() => setIsRecalibrating(false), 600);
    }
  };

  // Authentication.
  const handleAuth = async (type, formData) => {
  setAuthError('');

  try {
    // Your backend uses /register for account creation.
    const endpoint = type === 'signup'
      ? '/auth/register'
      : '/auth/login';

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await res.json();

    console.log('Authentication response:', data);

    if (!res.ok) {
      throw new Error(formatApiError(data, res.status));
    }

    // Support the different possible response structures.
    const userId =
      data.user_id ??
      data.id ??
      data.user?.user_id ??
      data.user?.id;

    const userEmail =
      data.email ??
      data.user?.email ??
      formData.email;

    if (!userId) {
      console.error('Authentication succeeded but no user ID was returned:', data);

      throw new Error(
        'Authentication succeeded, but the server did not return a user ID.'
      );
    }

    const authenticatedUser = {
      id: Number(userId),
      email: userEmail,
      name:
        data.name ??
        data.user?.name ??
        formData.name ??
        userEmail.split('@')[0]
    };

    console.log('Authenticated user:', authenticatedUser);

    setUser(authenticatedUser);
    localStorage.setItem(
      'foodnt_user',
      JSON.stringify(authenticatedUser)
    );

    setView('menu');
  } catch (err) {
    console.error('Authentication error:', err);

    setAuthError(
      err?.message || 'Authentication request failed.'
    );
  }
};

  const handleSignOut = () => {
    setUser(null);
    setView('landing');
  };

  // Add an item at the price that is actually visible when the user clicks.
  const handleAddToCart = (item) => {
    const remaining = Number(offerTimers[item.id] || 0);
    const offerActive = item.has_offer && remaining > 0;

    setCart((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        price: offerActive ? item.offer_price : item.base_price,
        original_price: item.base_price,
        promo_price: item.offer_price,
        offer_applied: offerActive
      }
    ]);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Backend currently creates one order record per dispatch.
  // To avoid silently losing a second cart item, require one item per dispatch.
  const handleCheckout = async () => {
    if (!user) {
      setView('auth');
      return;
    }

    if (cart.length === 0) {
      alert('Your order is empty.');
      return;
    }

    if (cart.length > 1) {
      alert(
        'This dispatch engine currently supports one item per fulfillment record.\n\n' +
        'Please remove the additional item and dispatch one item at a time.'
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      const primaryItem = cart[0];

      const authenticatedUserId = user?.id ?? user?.user_id;

console.log('Current authenticated user:', user);
console.log('Authenticated user ID:', authenticatedUserId);

if (!authenticatedUserId) {
  throw new Error(
    'Authenticated user ID is missing. Please sign out and sign in again.'
  );
}

const payload = {
  user_id: Number(authenticatedUserId),
        item_name: primaryItem.name,
        base_price: Number(primaryItem.original_price),
        offer_applied: Boolean(primaryItem.offer_applied),
        promo_price: Number(primaryItem.promo_price ?? primaryItem.price)
      };

      const res = await fetch(`${API_BASE}/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(formatApiError(orderData, res.status));
      }

      const origItem = orderData.original_item || primaryItem.name;
      const mutItem = orderData.mutated_item || MUTATION_MAP[primaryItem.name] || 'Classic Chicken Burger';
      const origImg = primaryItem.image || getFoodImage(origItem);
      const mutImg = getFoodImage(mutItem);

      const completeOrder = {
        ...orderData,
        original_item: origItem,
        mutated_item: mutItem,
        original_image: origImg,
        mutated_image: mutImg,
        order_integrity: mutItem !== origItem ? 'MODIFIED' : 'NOMINAL',
        driver_distance_km: orderData.driver_distance_km ?? 2.4,
        planned_km: orderData.planned_km ?? 2.4,
        actual_km: orderData.actual_km ?? 7.8,
        route_deviation: orderData.route_deviation ?? '+225%',
        status: orderData.status ?? 'In Transit',
        delivered: false,
        eta_minutes: orderData.eta_minutes ?? orderData.initial_eta ?? 14,
        deviation_index: '+0%',
        items: Array.isArray(orderData.items)
          ? orderData.items
          : [
              {
                name: origItem,
                mutated_name: mutItem,
                price: orderData.final_price,
                original_price: orderData.original_price,
                promo_price: orderData.promo_price,
                substituted: mutItem !== origItem
              }
            ]
      };

      const now = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setActiveOrder(completeOrder);

      setTelemetryLogs([
        {
          time: now,
          status: 'Order dispatched. Initializing route vector tracking.',
          deviation: '+0%'
        }
      ]);

      setCart([]);
      setView('tracking');
    } catch (err) {
      console.error('Dispatch error:', err);

      alert(
        err?.message ||
        'Dispatch execution failed. Please verify that the Foodnt backend is running.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        view={view}
        setView={setView}
        user={user}
        cartCount={cart.length}
        activeOrderId={activeOrder?.order_id}
      />

      <main className="main-content">
        {view === 'landing' && (
          <LandingView
            onBrowseMenu={() => setView('menu')}
            onTrackDelivery={() => {
              if (activeOrder) setView('tracking');
              else setView('menu');
            }}
            hasActiveOrder={Boolean(activeOrder)}
          />
        )}

        {view === 'menu' && (
          <MenuView
            menu={menu}
            offerTimers={offerTimers}
            onAddToCart={handleAddToCart}
          />
        )}

        {view === 'cart' && (
          <CartSummary
            cart={cart}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            isSubmitting={isCheckingOut}
          />
        )}

        {view === 'auth' && (
          <AuthView
            onAuth={handleAuth}
            authError={authError}
            currentUser={user}
            onSignOut={handleSignOut}
          />
        )}

        {view === 'tracking' && (
          <TrackingDashboard
            order={activeOrder}
            telemetryLogs={telemetryLogs}
            onRecalibrate={handleRecalibrate}
            isRecalibrating={isRecalibrating}
            onNewOrder={() => setView('menu')}
            onViewRoute={() => setView('route')}
          />
        )}

        {view === 'route' && (
          <DeliveryRouteView
            activeOrder={activeOrder}
            onRecalibrateBackend={handleRecalibrate}
          />
        )}
      </main>
    </div>
  );
}
