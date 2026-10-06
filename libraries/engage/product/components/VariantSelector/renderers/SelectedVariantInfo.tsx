import { useContext, type ComponentType } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';
import { ProductContext } from '../../context';
import ConnectedVariantAvailability from '../../ProductVariants/VariantAvailability';
import type { VariantSelection } from '../types';

const VariantAvailability = ConnectedVariantAvailability as unknown as ComponentType<{
  characteristics: VariantSelection;
  productId: string | null;
}>;

const useStyles = makeStyles({ name: 'SelectedVariantInfo' })(theme => ({
  root: {
    display: 'flow-root',
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
    '&:empty': {
      display: 'none',
    },
  },
}));

export interface SelectedVariantInfoProps {
  /** ID of the base product. */
  productId: string | null;
  /** The complete selection. */
  selection: VariantSelection;
}

/**
 * Shows availability and the back in stock button of the selected variant.
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
