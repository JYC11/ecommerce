import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";
export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (x) => x.productId === item.productId
      );
      if (existingItemIndex >= 0) {
        const existingCartItem = state.cartItems[existingItemIndex];
        const newQty = Number(existingCartItem.qty) + Number(item.qty);
        let updatedItem = {
          ...existingCartItem,
          qty: newQty > Number(item.countInStock) ? Number(existingCartItem.qty) : newQty,
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
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) => x.productId !== action.payload
        ),
      };
    default:
      return state;
  }
};
