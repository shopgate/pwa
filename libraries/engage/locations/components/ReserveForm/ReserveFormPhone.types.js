// @flow

export type OwnProps = {
  name: string,
  value: string,
  label: string,
  errorText: string,
  onChange: (value: string, event: any) => void;
}

export type StateProps = {
  userLocation: { [string]: any } | null;
}
