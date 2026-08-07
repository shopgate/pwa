import { useSelector } from 'react-redux';
import type { ShadowSize } from '@shopgate/engage/styles';
import type { CardStyle } from '@shopgate/engage/settings/types/appSettings';
import { getCardSettings, getCardShadowSize } from '@shopgate/engage/settings/selectors/appSettings';
import type { CardVariant } from './Card';

const VARIANT_BY_STYLE: Record<CardStyle, CardVariant> = {
  shadow: 'elevation',
  border: 'outlined',
  flat: 'elevation',
};

/**
 * Resolves the merchant-configured card appearance from app settings.
 * @returns The card variant and, for the shadow style, its elevation size.
 */
export const useCardAppearance = (): { variant: CardVariant; elevation: ShadowSize } => {
  const { style } = useSelector(getCardSettings);
  const elevation = useSelector(getCardShadowSize);

  return {
    variant: VARIANT_BY_STYLE[style] ?? 'elevation',
    elevation,
  };
};
