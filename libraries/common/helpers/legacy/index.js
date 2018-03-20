import hideMenuBar from '@shopgate/pwa-core/commands/hideMenuBar';
import hideNavigationBar from '@shopgate/pwa-core/commands/hideNavigationBar';
import showNavigationBar from '@shopgate/pwa-core/commands/showNavigationBar';
import showTab from '@shopgate/pwa-core/commands/showTab';

/**
 * Page context that comes from the app.
 * @type {Object}
 */
let currentPageContext = {};

/**
 * Get Page context if available.
 * @returns {Object}
 */
export const getPageContext = () => currentPageContext;

/**
 * Hides the legacy navigation views.
 */
export const hideLegacyNavigation = () => {
  hideMenuBar({ animation: null });
  hideNavigationBar({ animation: 'none' });
};

/**
 * Shows the legacy navigation views.
 */
export const showLegacyNavigation = () => {
  showNavigationBar({ animation: 'none' });
};

/**
 * Shows the main tab when legacy system requests the previous tab.
 * @param {Object} context The page context from the app.
 * @param {string} context.tab The tab where the page is opened.
 */
export const pageContext = (context) => {
  currentPageContext = context;
};

/**
 * Shows the main tab when legacy system requests the previous tab.
 */
export const showPreviousTab = () => {
  showTab({ targetTab: currentPageContext.tab ? currentPageContext.tab : 'main' });
};
