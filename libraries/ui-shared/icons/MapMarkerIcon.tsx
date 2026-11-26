import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The map marker icon component.
 */
const MapMarkerIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="mapMarker" {...props} />
);

export default MapMarkerIcon;
