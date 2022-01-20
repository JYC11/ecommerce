import { CART_ADD_ITEM } from "../constants/cartConstants";
export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (x) => x.productId === item.productId
      );
      if (existingItemIndex >= 0) {
        const existingCartItem = state.cartItems[existingItemIndex];
        let updatedItem = {
          ...existingCartItem,
          qty: Number(existingCartItem.qty) + Number(item.qty),
        };
        let updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = updatedItem;
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    default:
      return state;
  }
};
