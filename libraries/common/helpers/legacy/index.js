import hideMenuBar from '@shopgate/pwa-core/commands/hideMenuBar';
import broadcastEvent from '@shopgate/pwa-core/commands/broadcastEvent';
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
 * Prepares the NavigationBar and the MenuBar of the app legacy part for the PWA.
 */
export const prepareLegacyNavigation = () => {
  /**
   * Broadcasts an event to the pwa_navigation_bar webview and updates the navigation bar with
   * type "none". Event parameters are defined accordingly to the specification of the native
   * updateNavigationBar event.
   */
  broadcastEvent({
    event: 'updateNavigationBar',
    parameters: ['', 'none', { type: 'none' }],
  });

  hideMenuBar({ animation: null });
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
