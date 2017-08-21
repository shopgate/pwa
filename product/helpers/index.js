/**
 * Calculates the percentage discount for two unit prices
 * @param {number} price The current price
 * @param {number} priceOld The old price
 * @return {number} The discount
 */
export const calcDiscount = (price, priceOld) => {
  const savedAmount = priceOld - price;
  const discount = Math.round((savedAmount / priceOld) * 100);
  return (discount > 0) ? discount : 0;
};
