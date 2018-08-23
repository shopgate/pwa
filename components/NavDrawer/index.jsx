import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';
import ShippingButton from './components/ShippingButton';
import PaymentButton from './components/PaymentButton';
import TermsButton from './components/TermsButton';
import PrivacyButton from './components/PrivacyButton';

/**
 * @returns {JSX}
 */
const NavDrawerContainer = () => (
  <NavDrawer>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
    <NavDrawer.Divider />
    <NavDrawer.Divider />
    <ShippingButton />
    <PaymentButton />
    <TermsButton />
    <PrivacyButton />
  </NavDrawer>
);

export default NavDrawerContainer;

// import { UIEvents } from '@shopgate/pwa-core';
// import Portal from '@shopgate/pwa-common/components/Portal';
// import * as commonPortals from '@shopgate/pwa-common/constants/Portals';
// import * as categoryPortals from '@shopgate/pwa-common-commerce/category/constants/Portals';
// import * as favoritesPortals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
// import * as cartPortals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
// import * as marketPortals from '@shopgate/pwa-common-commerce/market/constants/Portals';
// import { INDEX_PATH, PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
// import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
// import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
// import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
// import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
// import appConfig from '@shopgate/pwa-common/helpers/config';
// import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
// import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
// import ViewListIcon from '@shopgate/pwa-ui-shared/icons/ViewListIcon';
// import ShoppingCartIcon from '@shopgate/pwa-ui-shared/icons/ShoppingCartIcon';
// import LocalShippingIcon from '@shopgate/pwa-ui-shared/icons/LocalShippingIcon';
// import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
// import CreditCardIcon from '@shopgate/pwa-ui-shared/icons/CreditCardIcon';
// import DescriptionIcon from '@shopgate/pwa-ui-shared/icons/DescriptionIcon';
// import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
// import LogoutIcon from '@shopgate/pwa-ui-shared/icons/LogoutIcon';
// import Layout from './components/Layout';
// import Item from './components/Item';
// import CartItem from './components/CartItem';
// import Divider from './components/Divider';
// import Header from './components/Header';
// import connect from './connector';

// // remove layout component
// // Change to use Transition
// // Change ref handling
// // Care about scrolling up after closing
// // Make icon imports named imports
// // Move actions to constants
// // take care about header
// // take care of cart badge
// // take care of favorite badge

// /**
//  * The NavDrawer component.
//  */
// class NavDrawer extends Component {
//   static OPEN = 'navdrawer_open';
//   static CLOSE = 'navdrawer_close';

//   static propTypes = {
//     cartProductCount: PropTypes.number,
//     entries: PropTypes.shape(),
//     highlightFavorites: PropTypes.bool,
//     logout: PropTypes.func,
//     user: PropTypes.shape(),
//   };

//   static defaultProps = {
//     cartProductCount: 0,
//     entries: {},
//     highlightFavorites: false,
//     logout: () => {},
//     user: null,
//   };

//   /**
//    * The constructor.
//    * @param {Object} props The component props.
//    */
//   constructor(props) {
//     super(props);

//     this.contentRef = null;
//     this.state = {
//       open: false,
//     };

//     // UIEvents.addListener(this.constructor.OPEN, this.show);
//     UIEvents.addListener(this.constructor.CLOSE, this.hide);
//   }

//   /**
//    * Sets a ref to the content element in order to reset scroll position.
//    * @param {HTMLElement} ref The element ref.
//    */
//   setContentRef = (ref) => {
//     this.contentRef = ref;
//   };

//   /**
//    * 
//    */
//   show = () => {
//     this.setState({ open: true });
//   }
  
//   /**
//    * 
//    */
//   hide = () => {
//     this.setState({ open: false });
//   }

//   /**
//    * Renders Items for the given menu entries.
//    * @param {Array} entries The menu entries.
//    * @returns {JSX}
//    */
//   renderEntries(entries) {
//     return entries.map(entry => (
//       <Item
//         href={INDEX_PATH}
//         icon={HomeIcon}
//         key={entry.url}
//         label={entry.label}
//         close={this.hide}
//       />
//     ));
//   }

//   /**
//    * Renders the component.
//    * @returns {JSX}
//    */
//   render() {
//     const {
//       entries,
//       user,
//       cartProductCount,
//       logout,
//     } = this.props;

//     const showQuickLinks = entries.quicklinks && !!entries.quicklinks.length;

//     const props = {
//       handleClose: this.hide,
//       Item,
//     };

//     return (
//       <Layout
//         active={this.state.open}
//         close={this.hide}
//         setContentRef={this.setContentRef}
//       >

//         {/* Header */}
//         <Portal
//           name={commonPortals.USER_MENU_CONTAINER_BEFORE}
//           props={{
//             ...props,
//             user,
//           }}
//         />
//         <Portal
//           name={commonPortals.USER_MENU_CONTAINER}
//           props={{
//             ...props,
//             user,
//           }}
//         >
//           <Header user={user} close={this.hide} />
//         </Portal>
//         <Portal
//           name={commonPortals.USER_MENU_CONTAINER_AFTER}
//           props={{
//             ...props,
//             user,
//           }}
//         />

//         <Portal name={commonPortals.NAV_MENU_CONTENT_BEFORE} props={props} />

//         {/* Home */}
//         <Portal name={commonPortals.NAV_MENU_HOME_BEFORE} props={props} />
//         <Portal name={commonPortals.NAV_MENU_HOME} props={props}>
//           <Item
//             href={INDEX_PATH}
//             icon={HomeIcon}
//             label="navigation.home"
//             close={this.hide}
//             testId="NavDrawerStartPage"
//           />
//         </Portal>
//         <Portal name={commonPortals.NAV_MENU_HOME_AFTER} props={props} />

//         {/* Categories */}
//         <Portal name={categoryPortals.NAV_MENU_CATEGORIES_BEFORE} props={props} />
//         <Portal name={categoryPortals.NAV_MENU_CATEGORIES} props={props}>
//           <Item
//             href={CATEGORY_PATH}
//             icon={ViewListIcon}
//             label="navigation.categories"
//             close={this.hide}
//             testId="navDrawerCategories"
//           />
//         </Portal>
//         <Portal name={categoryPortals.NAV_MENU_CATEGORIES_AFTER} props={props} />

//         {/* Favorites */}
//         <Portal name={favoritesPortals.NAV_MENU_FAVORITES_BEFORE} props={props} />
//         {appConfig.hasFavorites && (
//           <Portal
//             name={favoritesPortals.NAV_MENU_FAVORITES}
//             props={{
//               ...props,
//               withIndicator: this.props.highlightFavorites,
//             }}
//           >
//             <Item
//               href={FAVORITES_PATH}
//               icon={HeartIcon}
//               close={this.hide}
//               label="navigation.favorites"
//               withIndicator={this.props.highlightFavorites}
//               testId="favoritesButton"
//             />
//           </Portal>
//         )}
//         <Portal name={favoritesPortals.NAV_MENU_FAVORITES_AFTER} props={props} />

//         {/* Cart */}
//         <Portal
//           name={cartPortals.NAV_MENU_CART_BEFORE}
//           props={{
//             ...props,
//             productCount: cartProductCount,
//           }}
//         />
//         <Portal
//           name={cartPortals.NAV_MENU_CART}
//           props={{
//             ...props,
//             productCount: cartProductCount,
//           }}
//         >
//           <CartItem
//             close={this.hide}
//             count={cartProductCount}
//             href={CART_PATH}
//             icon={ShoppingCartIcon}
//             label="navigation.cart"
//           />
//         </Portal>
//         <Portal
//           name={cartPortals.NAV_MENU_CART_AFTER}
//           props={{
//             ...props,
//             productCount: cartProductCount,
//           }}
//         />

//         <Divider close={this.hide} />

//         {showQuickLinks && this.renderEntries(entries.quicklinks)}
//         {showQuickLinks && <Divider close={this.hide} />}

//         {/* Shipping */}
//         <Portal name={marketPortals.NAV_MENU_SHIPPING_BEFORE} props={props} />
//         <Portal name={marketPortals.NAV_MENU_SHIPPING} props={props}>
//           <Item
//             href={`${PAGE_PATH}/shipping`}
//             icon={LocalShippingIcon}
//             close={this.hide}
//             label="navigation.shipping"
//             testId="navDrawerShippingButton"
//           />
//         </Portal>
//         <Portal name={marketPortals.NAV_MENU_SHIPPING_AFTER} props={props} />

//         {/* Payment */}
//         <Portal name={marketPortals.NAV_MENU_PAYMENT_BEFORE} props={props} />
//         <Portal name={marketPortals.NAV_MENU_PAYMENT} props={props}>
//           <Item
//             href={`${PAGE_PATH}/payment`}
//             icon={CreditCardIcon}
//             close={this.hide}
//             label="navigation.payment"
//             testId="navDrawerPaymentButton"
//           />
//         </Portal>
//         <Portal name={marketPortals.NAV_MENU_PAYMENT_AFTER} props={props} />

//         <Divider close={this.hide} />

//         {/* Terms */}
//         <Portal name={commonPortals.NAV_MENU_TERMS_BEFORE} props={props} />
//         <Portal name={commonPortals.NAV_MENU_TERMS} props={props}>
//           <Item
//             href={`${PAGE_PATH}/terms`}
//             icon={DescriptionIcon}
//             close={this.hide}
//             label="navigation.terms"
//             testId="navDrawerTermsButton"
//           />
//         </Portal>
//         <Portal name={commonPortals.NAV_MENU_TERMS_AFTER} props={props} />

//         {/* Privacy */}
//         <Portal name={commonPortals.NAV_MENU_PRIVACY_BEFORE} props={props} />
//         <Portal name={commonPortals.NAV_MENU_PRIVACY} props={props}>
//           <Item
//             href={`${PAGE_PATH}/privacy`}
//             icon={SecurityIcon}
//             close={this.hide}
//             label="navigation.privacy"
//             testId="navDrawerPrivacyButton"
//           />
//         </Portal>
//         <Portal name={commonPortals.NAV_MENU_PRIVACY_AFTER} props={props} />

//         {/* Return Policy */}
//         <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_BEFORE} props={props} />
//         {showReturnPolicy && (
//           <Portal name={marketPortals.NAV_MENU_RETURN_POLICY} props={props}>
//             <Item
//               href={`${PAGE_PATH}/return_policy`}
//               icon={DescriptionIcon}
//               close={this.hide}
//               label="navigation.return_policy"
//               testId="navDrawerReturnPolicyButton"
//             />
//           </Portal>
//         )}
//         <Portal name={marketPortals.NAV_MENU_RETURN_POLICY_AFTER} props={props} />

//         {/* Imprint */}
//         <Portal name={commonPortals.NAV_MENU_IMPRINT_BEFORE} props={props} />
//         <Portal name={commonPortals.NAV_MENU_IMPRINT} props={props}>
//           <Item
//             href={`${PAGE_PATH}/imprint`}
//             icon={InfoIcon}
//             close={this.hide}
//             label="navigation.about"
//             testId="navDrawerImprintButton"
//           />
//         </Portal>
//         <Portal name={commonPortals.NAV_MENU_IMPRINT_AFTER} props={props} />

//         {user && <Divider close={this.hide} />}

//         <Portal name={commonPortals.NAV_MENU_LOGOUT_BEFORE} props={props} />
//         <Portal
//           name={commonPortals.NAV_MENU_LOGOUT}
//           props={{
//             ...props,
//             handleLogout: logout,
//           }}
//         >
//           {user && (
//             <Item
//               onClick={logout}
//               icon={LogoutIcon}
//               close={this.hide}
//               label="navigation.logout"
//               testId="logoutButtonNavDrawer"
//             />
//           )}
//         </Portal>
//         <Portal name={commonPortals.NAV_MENU_LOGOUT_AFTER} props={props} />

//         <Portal name={commonPortals.NAV_MENU_CONTENT_AFTER} props={props} />

//         <ClientInformation />

//       </Layout>
//     );
//   }
// }

// export default connect(NavDrawer);

// export { NavDrawer as Unwrapped };
