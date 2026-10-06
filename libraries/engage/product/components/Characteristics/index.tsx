import { useContext } from 'react';
import { router } from '@shopgate/pwa-common/helpers/router';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_VARIANT_SELECT,
  PRODUCT_VARIANT_SELECT_AFTER,
  PRODUCT_VARIANT_SELECT_BEFORE,
} from '@shopgate/engage/product/constants';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { VariantSelector } from '../VariantSelector';
import type { VariantSelectorProps } from '../VariantSelector';

export interface CharacteristicsProps {
  /** ID of the base product. */
  productId?: string | null;
  /** ID of the currently shown variant. */
  variantId?: string | null;
}

interface ProductContextValue {
  conditioner: VariantSelectorProps['conditioner'];
  setCharacteristics: VariantSelectorProps['onCharacteristicsChange'];
  characteristics: VariantSelectorProps['characteristics'];
}

/**
 * Shows the selected variant on the current product page.
 * @param productId The ID of the variant.
 */
const navigate = (productId: string) => {
  const route = router.getCurrentRoute();
  router.update(route.id, { productId });
};

/**
 * The Characteristics component.
 * @returns The variant selection of the product page.
 */
const Characteristics = ({ productId = null, variantId = null }: CharacteristicsProps) => {
  const context = useContext(ProductContext) as ProductContextValue;

  return (
    <>
      <Portal name={PRODUCT_VARIANT_SELECT_BEFORE} />
      <Portal name={PRODUCT_VARIANT_SELECT}>
        <VariantSelector
          productId={productId}
          variantId={variantId}
          onVariantSelected={navigate}
          finishTimeout={200}
          conditioner={context.conditioner}
          characteristics={context.characteristics}
          onCharacteristicsChange={context.setCharacteristics}
        />
      </Portal>
      <Portal name={PRODUCT_VARIANT_SELECT_AFTER} />
    </>
  );
};

export default Characteristics;
