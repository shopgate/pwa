import { useEffect, useState } from 'react';

const SDK_ID = 'sg-paypal-sdk';

let renderQueue = [];

/**
 * Asynchronously loads the javascript paypal sdk
 * @param {Object} settings Payment method settings
 * @returns {Promise}
 * */
export const loadWebSdk = settings => new Promise((resolve, reject) => {
  if (document.querySelector(`#${SDK_ID}`)) {
    resolve();
    return;
  }

  const script = document.createElement('script');
  script.id = SDK_ID;
  script.onload = () => {
    resolve();
    renderQueue.forEach(cb => cb());
    renderQueue = [];
  };
  script.onerror = reject;
  script.src = `https://www.paypal.com/sdk/js?client-id=${settings.clientId}&components=buttons,funding-eligibility,marks${settings.env === 'sandbox' ? '&debug=true' : ''}&disable-funding=credit,card&integration-date=2020-11-13&intent=authorize`;
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
