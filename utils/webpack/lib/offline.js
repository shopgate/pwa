/* global navigator, window */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const logger = console;

    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        logger.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        logger.log('SW registration failed: ', registrationError);
      });
  });
}
