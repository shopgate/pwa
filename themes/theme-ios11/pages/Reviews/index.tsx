import { RouteContext } from '@shopgate/pwa-common/context';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { View } from '@shopgate/engage/components';
import { ReviewsPage } from '@shopgate/engage/reviews';
import { BackBar } from 'Components/AppBar/presets';

const ViewComponent = View as React.ComponentType<{
  'aria-hidden'?: boolean;
  children?: React.ReactNode;
}>;

/**
 * The subset of the current route that the review page reads.
 */
interface ReviewsRoute {
  params: { productId: string };
}

interface ReviewsProps {
  /** The id of the route product; nothing renders without it. */
  id?: string | null;
}

/**
 * The product reviews page.
 * @returns The rendered page.
 */
const Reviews = ({ id = null }: ReviewsProps) => (
  <ViewComponent aria-hidden={false}>
    {id && (
      <>
        <BackBar title="titles.reviews" right={null} />
        <ReviewsPage productId={id} />
      </>
    )}
  </ViewComponent>
);

export default () => (
  <RouteContext.Consumer>
    {(route: ReviewsRoute) => (
      <Reviews id={(hex2bin(route.params.productId) as string | false) || null} />
    )}
  </RouteContext.Consumer>
);

export { Reviews as UnwrappedReviews };
