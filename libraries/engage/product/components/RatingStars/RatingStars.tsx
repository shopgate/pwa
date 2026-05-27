import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getProductRating } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { RatingStars } from '@shopgate/engage/components';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';

const { hasReviews } = appConfig as { hasReviews: boolean };

type RatingState = {
  rating: {
    average: number;
    count: number;
    reviewCount: number;
  } | null;
};

interface RatingProps {
  /**
   * Id of the product to show the rating for.
   */
  productId: string;
  /**
   * Size of the rating stars.
   * @default 'small'
   */
  size?: 'big' | 'small' | 'large';
}

/**
 * The product RatingStars component.
 */
const ProductRatingStars = ({
  productId,
  size = 'small',
}: RatingProps) => {
  const rating = useSelector(state =>
    // @ts-expect-error - getProductRating is not typed yet
    getProductRating(state, { productId })) as RatingState['rating'];

  const { showEmptyRatingStars = false } = useWidgetSettings('@shopgate/engage/rating') as { showEmptyRatingStars: boolean };

  const showRatings = useMemo(() => {
    if (hasReviews && (rating?.average ?? 0) > 0) {
      return true;
    }

    if (hasReviews && showEmptyRatingStars && rating) {
      return true;
    }

    return false;
  }, [rating, showEmptyRatingStars]);

  if (!showRatings) {
    return null;
  }

  return (
    <RatingStars value={rating?.average || 0} display={size} />
  );
};

export default memo(ProductRatingStars);
