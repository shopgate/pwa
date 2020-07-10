// @flow
import * as React from 'react';
import { I18n } from '../../../components';
import { type Location } from '../../locations.types';

type Props = {
  availabilityText: string,
  location: Location,
  inventory: any,
  maxNumberVisible: number,
  aboveMaxExtension: string,
}

/**
 * Renders the inventory given by the location into a given translation string.
 * @param {Object} props The component props.
 * @param {string} props.availabilityText The translation string to use.
 * @param {Object} props.location The component props.
 * @param {number|undefined} props.maxNumberVisible The component props.
 * @param {string} props.aboveMaxExtension The component props.
 * @return {JSX}
 */
export function StockInfoInventory(props: Props) {
  const {
    availabilityText, location, inventory, maxNumberVisible, aboveMaxExtension,
  } = props;

  const visibleInventory = React.useMemo(() => {
    if (!location || !inventory) {
      return null;
    }

    if (
      inventory.visible !== null
      && inventory.visible > maxNumberVisible
    ) {
      return `${maxNumberVisible}${aboveMaxExtension}`;
    }
    return inventory.visible;
  }, [aboveMaxExtension, inventory, location, maxNumberVisible]);

  if (!location || !availabilityText || !inventory) {
    return null;
  }

  return (
    <I18n.Text string={availabilityText} params={{ visibleInventory }} />
  );
}
