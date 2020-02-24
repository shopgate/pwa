// @flow

export type OwnProps = {
  onLocationSelect: Function;
  locationId?: string | null;
}

export type StateProps = {
  product: Object | null;
  locations: Object[];
  loading: boolean;
}
