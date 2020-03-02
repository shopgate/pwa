// @flow
import { type Location } from '../../locations.types';

export type OwnProps = {
  onLocationSelect: () => void;
  locationId?: string | null;
}

export type StateProps = {
  product: Object | null;
  locations: Location[];
  loading: boolean;
}
