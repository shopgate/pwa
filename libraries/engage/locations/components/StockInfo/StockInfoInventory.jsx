import * as React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '../../../components';

/**
 * Renders the inventory given by the location into a given translation string.
 * @param {Object} props The component props.
 * @param {string} props.availabilityText The translation string to use.
 * @param {Object} props.location The component props.
 * @param {number|undefined} props.maxNumberVisible The component props.
 * @param {string} props.aboveMaxExtension The component props.
 * @return {JSX}
 */
export function StockInfoInventory(props) {
  const {
    availabilityText,
    comingSoon,
    location,
    inventory,
    maxNumberVisible,
    aboveMaxExtension,
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

  if ((!location || !availabilityText || !inventory) && !comingSoon) {
    return null;
  }

  return (
    <I18n.Text string={availabilityText} params={{ visibleInventory }} />
  );
}

StockInfoInventory.propTypes = {
  aboveMaxExtension: PropTypes.string.isRequired,
  availabilityText: PropTypes.string.isRequired,
  location: PropTypes.shape().isRequired,
  maxNumberVisible: PropTypes.number.isRequired,
  comingSoon: PropTypes.bool,
  inventory: PropTypes.shape(),
};

StockInfoInventory.defaultProps = {
  comingSoon: false,
  inventory: null,
};
