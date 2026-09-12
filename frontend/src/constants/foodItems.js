export const FOOD_ITEM_IMAGES = {
  'Truffle Mushroom Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'Wood-fired Margherita Pizza': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
  'Slow-cooked Hyderabadi Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'Artisanal Matcha Latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',

  // Mutated counterparts
  'Classic Chicken Burger': 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
  'Four Cheese Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'Kerala Chicken Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'Vanilla Cold Coffee': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80'
};

export const MUTATION_MAP = {
  'Truffle Mushroom Burger': 'Classic Chicken Burger',
  'Wood-fired Margherita Pizza': 'Four Cheese Pizza',
  'Slow-cooked Hyderabadi Biryani': 'Kerala Chicken Biryani',
  'Artisanal Matcha Latte': 'Vanilla Cold Coffee'
};

export function getFoodImage(name) {
  if (!name) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  return FOOD_ITEM_IMAGES[name] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
}
