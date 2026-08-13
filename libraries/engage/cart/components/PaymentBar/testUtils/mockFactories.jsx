/* eslint-disable react/prop-types, require-jsdoc */
const React = require('react');

const createSurroundPortalsMock = () => function SurroundPortals(props) {
  return <div data-testid="surround-portals">{props.children}</div>;
};

const createCartTotalLineMock = () => {
  function CartTotalLine(props) {
    return <div data-testid="cart-total-line" className={props.className}>{props.children}</div>;
  }

  CartTotalLine.Label = function Label() {
    return <div data-testid="cart-total-line-label" />;
  };

  CartTotalLine.Amount = function Amount() {
    return <div data-testid="cart-total-line-amount" />;
  };

  CartTotalLine.Hint = function Hint() {
    return <div data-testid="cart-total-line-hint" />;
  };

  CartTotalLine.Spacer = function Spacer(props) {
    return <div data-testid="cart-total-line-spacer" className={props.className} />;
  };

  return CartTotalLine;
};

const createButtonMock = () => function Button(props) {
  return (
    <button
      type="button"
      className={props.className}
      disabled={props.disabled}
      data-color={props.color}
    >
      {props.children}
    </button>
  );
};

module.exports = {
  createSurroundPortalsMock,
  createCartTotalLineMock,
  createButtonMock,
};

/* eslint-enable react/prop-types, require-jsdoc */
