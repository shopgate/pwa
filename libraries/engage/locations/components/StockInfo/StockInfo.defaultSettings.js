import {
  AVAILABILITY_TYPE_AVAILABLE,
  AVAILABILITY_TYPE_LIMITED_AVAILABILITY,
  AVAILABILITY_TYPE_NOT_AVAILABLE,
  AVAILABILITY_TYPE_CUSTOM_AVAILABILITY,
  AVAILABILITY_TYPE_COMING_SOON,
} from '@shopgate/engage/product/constants';

/**
 * Default stock info settings with theme palette colors.
 * @param {Object} theme Engage theme from `useTheme()` / `makeStyles`.
 * @returns {Object}
 */
export const createStockInfoDefaultSettings = theme => ({
  [AVAILABILITY_TYPE_AVAILABLE]: {
    visibleInventoryFrom: 11,
    visibleInventoryTo: null,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: 'locations.stock_info.availableInventory',
    availabilityTextColor: theme.palette.success.main,
  },
  [AVAILABILITY_TYPE_COMING_SOON]: {
    comingSoon: true,
    visibleInventoryFrom: 0,
    visibleInventoryTo: Number.MAX_VALUE,
    includeInventoryBlind: true,
    includeNoRecordStores: true,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_COMING_SOON}`,
    availabilityTextColor: theme.palette.warning.main,
  },
  [AVAILABILITY_TYPE_LIMITED_AVAILABILITY]: {
    visibleInventoryFrom: 1,
    visibleInventoryTo: 10,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_LIMITED_AVAILABILITY}`,
    availabilityTextColor: theme.palette.warning.main,
  },
  [AVAILABILITY_TYPE_NOT_AVAILABLE]: {
    visibleInventoryFrom: 0,
    visibleInventoryTo: 0,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_NOT_AVAILABLE}`,
    availabilityTextColor: theme.palette.error.main,
    allowOrderingToStore: true,
  },
  [AVAILABILITY_TYPE_CUSTOM_AVAILABILITY]: {
    visibleInventoryFrom: 0,
    visibleInventoryTo: 0,
    includeInventoryBlind: false,
    includeNoRecordStores: true,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_CUSTOM_AVAILABILITY}`,
    availabilityTextColor: theme.palette.error.main,
    allowOrderingToStore: true,
  },
  maxNumberOfVisibleInventory: 100,
  aboveMaxExtension: '+',
});
