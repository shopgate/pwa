/* eslint-disable
  jsdoc/require-jsdoc,
  jsdoc/require-param,
  jsdoc/require-description,
  jsdoc/require-returns-description,
  jsdoc/no-types,
  @typescript-eslint/ban-ts-comment
*/
// @ts-nocheck We don't care about type checking in mocks

import noop from 'lodash/noop';
import UISharedSheet from '@shopgate/pwa-ui-shared/Sheet';
import UISharedDiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';

import SwiperMock from '@shopgate/pwa-common/components/Swiper/__mocks__';

export { MODAL_EVENTS } from '@shopgate/pwa-common/components/ModalContainer';
export { SHEET_EVENTS } from '@shopgate/pwa-ui-shared/Sheet';

// ICONS IOS
export const CartIconIOS = () => null;
export const FilterIconIOS = () => null;
export const HomeIconIOS = () => null;
export const ShareIconIOS = () => null;

// ICONS ANDROID
export const ShareIconAndroid = () => null;

// ICONS SHARED
export const AccountBoxIcon = () => null;
export const AddMoreIcon = () => null;
export const ArrowDropIcon = () => null;
export const ArrowIcon = () => null;
export const BarcodeScannerIcon = () => null;
export const BoxIcon = () => null;
export const BrowseIcon = () => null;
export const BurgerIcon = () => null;
export const CartIcon = () => null;
export const CartPlusIcon = () => null;
export const CheckedIcon = () => null;
export const CheckIcon = () => null;
export const ChevronIcon = () => null;
export const CreditCardIcon = () => null;
export const CrossIcon = () => null;
export const DescriptionIcon = () => null;
export const FilterIcon = () => null;
export const FlashEnabledIcon = () => null;
export const FlashDisabledIcon = () => null;
export const GridIcon = () => null;
export const HeartIcon = () => null;
export const HeartOutlineIcon = () => null;
export const HomeIcon = () => null;
export const InfoOutlineIcon = () => null;
export const ListIcon = () => null;
export const LocalShippingIcon = () => null;
export const LockIcon = () => null;
export const LogoutIcon = () => null;
export const MoreIcon = () => null;
export const MoreVertIcon = () => null;
export const PlaceholderIcon = () => null;
export const RadioCheckedIcon = () => null;
export const RadioUncheckedIcon = () => null;
export const SecurityIcon = () => null;
export const ShoppingCartIcon = () => null;
export const SortIcon = () => null;
export const StarHalfIcon = () => null;
export const StarIcon = () => null;
export const StarOutlineIcon = () => null;
export const TickIcon = () => null;
export const TrashIcon = () => null;
export const UncheckedIcon = () => null;
export const ViewListIcon = () => null;
export const VisibilityIcon = () => null;
export const VisibilityOffIcon = () => null;
export const InfoIcon = () => null;
export const LocatorIcon = () => null;
export const MagnifierIcon = () => null;
export const LocationIcon = () => null;
export const PhoneIcon = () => null;
export const TimeIcon = () => null;

// COMPONENTS
export const ProgressBar = () => null;
export const MessageBar = () => null;
export const Input = () => null;
export const Link = ({ children }) => children;
export const Ellipsis = ({ children }) => children;
/** @returns {ReactElement} */
export const SurroundPortals = ({ children }) => children;
/** @returns {ReactElement} */
// eslint-disable-next-line react/prop-types
export const Portal = ({ children }) => children || null; // null for portals like before, after
export const Accordion = ({ children }) => children;
export const AccordionContainer = ({ children, open = false }) => children({
  handleClose: noop,
  open,
  handleOpen: noop,
});
export const ResponsiveContainer = ({ children }) => children;
export const Grid = ({ children }) => children;
Grid.Item = ({ children }) => children;
Grid.Item.displayName = 'Grid.Item';
export const Price = () => null;
export const PriceStriked = () => null;
export const PriceInfo = () => null;
export const RangeSlider = () => null;
export const RatingStars = () => null;
export const RatingNumber = ({ rating }) => rating;
export const Availability = () => null;
export const TextLink = () => null;
export const ProductImage = ({ children }) => children;
export const PlaceholderParagraph = ({ children }) => children;
export const PlaceholderLabel = ({ children }) => children;
/** @returns {ReactElement} */
export const HtmlSanitizer = ({ children }) => children;
export const RippleButton = ({ children }) => children;
export const Button = ({ children }) => children;
export const SheetDrawer = UISharedSheet;
export const SheetList = ({ children }) => children;
SheetList.Item = () => null;
SheetList.Item.displayName = 'SheetList.Item';
export const PriceDifference = () => 'PriceDifference';
export const TaxDisclaimer = () => 'TaxDisclaimer';
export const ToggleIcon = jest.requireActual('@shopgate/pwa-ui-shared/ToggleIcon').default;
export const PickerUtilize = () => 'PickerUtilize';
export const Sheet = jest.requireActual('@shopgate/pwa-ui-shared/Sheet').default;
export const Swiper = SwiperMock;
export const Backdrop = () => null;
export const DiscountBadge = UISharedDiscountBadge;

// HELPERS
export const I18n = {
  Text: ({ string }) => string,
  Placeholder: () => null,
  Price: () => null,
  Number: ({ number }) => number,
  Date: ({ timestamp, format }) => `${timestamp}-${format}`,
};

const ActualI18n = jest.requireActual('@shopgate/pwa-common/components/I18n').default;
I18n.Text.propTypes = ActualI18n.Text.propTypes;
I18n.Placeholder.propTypes = ActualI18n.Placeholder.propTypes;
I18n.Price.propTypes = ActualI18n.Price.propTypes;
I18n.Number.propTypes = ActualI18n.Number.propTypes;
I18n.Date.propTypes = ActualI18n.Date.propTypes;
I18n.Text.defaultProps = ActualI18n.Text.defaultProps;
I18n.Placeholder.defaultProps = ActualI18n.Placeholder.defaultProps;
I18n.Price.defaultProps = ActualI18n.Price.defaultProps;
I18n.Number.defaultProps = ActualI18n.Number.defaultProps;
I18n.Date.defaultProps = ActualI18n.Date.defaultProps;

export { default as View, ViewContext } from '../View/__mocks__/index';
export { default as ConnectedReactPortal } from '../ConnectedReactPortal/__mocks__/index';

/* eslint-enable
  jsdoc/require-jsdoc,
  jsdoc/require-param,
  jsdoc/require-description,
  jsdoc/require-returns-description,
  jsdoc/no-types,
  @typescript-eslint/ban-ts-comment
*/
