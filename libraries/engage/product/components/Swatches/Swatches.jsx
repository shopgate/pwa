import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_SWATCHES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '../../../components';
import { isBeta, useWidgetSettings } from '../../../core';
import { Swatch } from '../Swatch';
import { swatchesClass } from './style';
import connect from './connector';

const WIDGET_ID = '@shopgate/engage/product/Swatches';

/**
 * Renders only product swatches from a list of characteristics.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatches = ({ productId, characteristics }) => {
  if (!isBeta()) {
    return null;
  }

  if (!characteristics) {
    return null;
  }

  const settings = useWidgetSettings(WIDGET_ID);

  let swatches = characteristics.filter(c => c.swatch === true);
  if (settings.filter && settings.filter.length) {
    swatches = swatches.filter(swatch => settings.filter.includes(swatch.id));
  }
  if (!swatches) {
    return null;
  }

  if (settings.maxItemCount) {
    swatches = swatches.map(swatch => ({
      ...swatch,
      values: swatch.values.slice(0, settings.maxItemCount),
    }));
  }

  return (
    <SurroundPortals portalName={PRODUCT_SWATCHES} portalProps={{ characteristics }}>
      <div className={swatchesClass}>
        {swatches.map(swatch => (
          <Swatch key={`${productId}.${swatch.id}`} swatch={swatch} />
          ))}
      </div>
    </SurroundPortals>
  );
};

Swatches.propTypes = {
  productId: PropTypes.string.isRequired,
  characteristics: PropTypes.arrayOf(PropTypes.shape()),
};

Swatches.defaultProps = {
  characteristics: null,
};

export default connect(memo(Swatches));
