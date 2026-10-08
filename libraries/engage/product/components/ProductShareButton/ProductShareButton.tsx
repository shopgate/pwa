import { IconButton } from '@shopgate/engage/components/v2';
import type { IconButtonSize } from '@shopgate/engage/components/v2';
import { ShareIconIOS } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { cx } from '@shopgate/engage/styles';
import useProductShare from '../../hooks/useProductShare';

export interface ProductShareButtonProps {
  productId: string | null;
  size?: IconButtonSize;
  className?: string;
  'aria-hidden'?: boolean;
}

/**
 * Action button that opens the native share sheet for a product. Renders nothing when the share
 * button is switched off or the product has no url to share.
 * @returns The button.
 */
const ProductShareButton = ({
  productId,
  size = 'medium',
  className,
  'aria-hidden': ariaHidden,
}: ProductShareButtonProps) => {
  const { enabled, canShare, share } = useProductShare(productId);

  if (!enabled || !canShare) {
    return null;
  }

  return (
    <IconButton
      aria-label={i18n.text('product.share')}
      aria-hidden={ariaHidden}
      variant="surface"
      color="secondary"
      size={size}
      className={cx('engage__product-share-button', className)}
      onClick={share}
    >
      <ShareIconIOS />
    </IconButton>
  );
};

export default ProductShareButton;
