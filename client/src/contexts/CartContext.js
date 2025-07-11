import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  total: 0
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => 
          item.product._id === action.payload.product._id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product._id === action.payload.product._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'CALCULATE_TOTAL':
      return {
        ...state,
        total: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate total whenever items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTAL' });
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart
  const addToCart = (product, quantity = 1, size = null, color = null) => {
    const cartItem = {
      id: `${product._id}-${size}-${color}`,
      product,
      quantity,
      size,
      color,
      price: product.price
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    toast.success('Added to cart!');
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart');
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId, size = null, color = null) => {
    return state.items.some(
      item => 
        item.product._id === productId &&
        item.size === size &&
        item.color === color
    );
  };

  const value = {
    items: state.items,
    total: state.total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 