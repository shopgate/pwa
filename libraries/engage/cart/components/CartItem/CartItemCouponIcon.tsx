import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { isIOSTheme } from '@shopgate/engage/core/helpers';
import { CartCouponIcon } from '@shopgate/engage/components';
import ThemeIcon from '@shopgate/engage/icons/components/ThemeIcon';
import { useThemeIcon } from '@shopgate/engage/icons/hooks';

interface CartCouponIconSettings {
  /**
   * The viewBox for a coupon icon customized in the theme extension config.
   */
  viewBox?: string | null;
  /**
   * The color of the icon.
   */
  color?: string | null;
}

/**
 * Renders the cart item coupon icon.
 * @returns The icon.
 */
export const CartItemCouponIcon = () => {
  const { viewBox, color } = useWidgetSettings(
    '@shopgate/engage/components/CartCouponIcon'
  ) as CartCouponIconSettings;
  const icon = useThemeIcon('cartCoupon');

  if (!isIOSTheme() && icon?.source === 'default') {
    return <CartCouponIcon />;
  }

  return (
    <ThemeIcon
      name="cartCoupon"
      viewBox={viewBox ?? undefined}
      color={color ?? undefined}
    />
  );
};
