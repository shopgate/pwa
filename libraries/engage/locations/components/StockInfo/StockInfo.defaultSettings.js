import { themeColors } from '@shopgate/pwa-common/helpers/config';
import {
  AVAILABILITY_TYPE_AVAILABLE,
  AVAILABILITY_TYPE_LIMITED_AVAILABILITY,
  AVAILABILITY_TYPE_NOT_AVAILABLE,
  AVAILABILITY_TYPE_CUSTOM_AVAILABILITY,
} from '@shopgate/engage/product/constants';

export default {
  [AVAILABILITY_TYPE_AVAILABLE]: {
    visibleInventoryFrom: 11,
    visibleInventoryTo: null,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: 'locations.stock_info.availableInventory',
    availabilityTextColor: themeColors.success,
  },
  [AVAILABILITY_TYPE_LIMITED_AVAILABILITY]: {
    visibleInventoryFrom: 1,
    visibleInventoryTo: 10,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_LIMITED_AVAILABILITY}`,
    availabilityTextColor: themeColors.warning,
  },
  [AVAILABILITY_TYPE_NOT_AVAILABLE]: {
    visibleInventoryFrom: 0,
    visibleInventoryTo: 0,
    includeInventoryBlind: false,
    includeNoRecordStores: false,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_NOT_AVAILABLE}`,
    availabilityTextColor: themeColors.error,
    allowOrderingToStore: true,
  },
  [AVAILABILITY_TYPE_CUSTOM_AVAILABILITY]: {
    visibleInventoryFrom: 0,
    visibleInventoryTo: 0,
    includeInventoryBlind: false,
    includeNoRecordStores: true,
    availabilityText: `locations.stock_info.${AVAILABILITY_TYPE_CUSTOM_AVAILABILITY}`,
    availabilityTextColor: themeColors.error,
    allowOrderingToStore: true,
  },
  maxNumberOfVisibleInventory: 100,
  aboveMaxExtension: '+',
};
