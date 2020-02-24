// @flow

export type OwnProps = {
  cartItem: Object;
  registerAction?: Function;
}

export type DispatchProps = {
  fetchProductLocations: Function;
  updateProductInCart: Function;
}
