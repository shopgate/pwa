import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';
import { ProductContext } from '../../context';
import ConnectedVariantAvailability from '../../ProductVariants/VariantAvailability';
import type { VariantSelection } from '../types';

const VariantAvailability = ConnectedVariantAvailability as unknown as React.ComponentType<{
  characteristics: VariantSelection;
  productId: string | null;
}>;

const useStyles = makeStyles({ name: 'SelectedVariantInfo' })({
  root: {
    display: 'flow-root',
    padding: '0 16px',
    marginTop: -8,
    marginBottom: 16,
    '&:empty': {
      display: 'none',
    },
  },
});

export interface SelectedVariantInfoProps {
  /** ID of the base product. */
  productId: string | null;
  /** The complete selection. */
  selection: VariantSelection;
}

/**
 * Shows availability and the back in stock button of the selected variant.
 * @param props The component props.
 * @returns The info.
 */
const SelectedVariantInfo = ({ productId, selection }: SelectedVariantInfoProps) => {
  const { classes, cx } = useStyles();
  const { fulfillmentMethods = null, isFetching = false } = useContext(ProductContext) || {};

  return (
    <div className={cx(classes.root, 'engage__variant-selector__selected-variant')}>
      {!fulfillmentMethods && !isFetching && (
        <VariantAvailability characteristics={selection} productId={productId} />
      )}
      <CharacteristicsButton characteristics={selection} />
    </div>
  );
};

export default SelectedVariantInfo;
