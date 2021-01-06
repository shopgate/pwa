import { useEffect, useState } from 'react';

const SDK_ID = 'sg-paypal-sdk';

let renderQueue = [];

/**
 * Asynchronously loads the javascript paypal sdk
 * @param {Object} settings Payment method settings
 * @param {Object} order The active order
 * @returns {Promise}
 * */
export const loadWebSdk = (settings, order) => new Promise((resolve, reject) => {
  if (document.querySelector(`#${SDK_ID}`)) {
    resolve();
    return;
  }

  const script = document.createElement('script');
  script.id = SDK_ID;
  script.setAttribute('data-partner-attribution-id', 'ShopgateGmbH_Cart_PPCP');
  script.onload = () => {
    resolve();
    renderQueue.forEach(cb => cb());
    renderQueue = [];
  };
  script.onerror = reject;

  const parameters = {
    'client-id': settings.clientId,
    'merchant-id': settings.merchantIdInPayPal,
    'disable-funding': 'credit,card',
    'integration-date': '2020-12-07',
    currency: order.currencyCode,
    intent: 'authorize',
    components: 'buttons,funding-eligibility,marks',
    ...(settings.env === 'sandbox' ? {
      debug: 'true',
    } : {}),
  };
  const parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  script.src = `https://www.paypal.com/sdk/js?${parametersString}`;
  document.head.appendChild(script);
});

/**
 * Hook that ensures that component will be supplied with the sdk once loaded.
 * @returns {Object}
 */
export const usePaypal = () => {
  const [paypal, setPaypal] = useState(window.paypal || null);
  useEffect(() => {
    if (paypal) {
      return;
    }
    renderQueue.push(() => setPaypal(window.paypal));
  }, [paypal]);
  return paypal;
};
