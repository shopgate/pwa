import type { Location } from '../locations.types';

/**
 * The location data the app keeps, e.g. the preferred location and the fetched locations.
 */
export interface LocationsStorageState {
  /**
   * Whether a change is pending.
   */
  pending: boolean;
  /**
   * Whether locations are being fetched.
   */
  isFetching: boolean;
  /**
   * Whether locations were received at least once.
   */
  initialized?: boolean;
  /**
   * The preferred location of the user.
   */
  preferredLocation: { code: string | null };
  /**
   * The preferred fulfillment method.
   */
  preferredFulfillmentMethod: { type: string | null };
  /**
   * The locations by their codes.
   */
  locationsByCode: Record<string, Location>;
  /**
   * The inventories by hashes of product code and location code.
   */
  inventoriesByCodePair: Record<string, object>;
  /**
   * The location codes by filter hashes.
   */
  locationsByFilter: Record<string, string[]>;
  /**
   * The fulfillment slots by location codes.
   */
  fulfillmentSlotsByLocation: Record<string, unknown[]>;
}
