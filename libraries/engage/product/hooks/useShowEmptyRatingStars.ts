import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getShowEmptyRatingStars,
} from '@shopgate/engage/settings/selectors/appSettings';

const RATING_WIDGET_ID = '@shopgate/engage/rating';

/**
 * Resolves whether rating stars are also rendered for products without a rating.
 * @returns Whether empty rating stars are shown.
 */
const useShowEmptyRatingStars = (): boolean => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const showEmptyStars = useSelector(getShowEmptyRatingStars);

  const { showEmptyRatingStars: legacyShowEmptyRatingStars = false } =
    (useWidgetSettings(RATING_WIDGET_ID) || {}) as { showEmptyRatingStars?: boolean };

  if (!areAppSettingsHydrated) {
    return legacyShowEmptyRatingStars;
  }

  return showEmptyStars;
};

export default useShowEmptyRatingStars;
