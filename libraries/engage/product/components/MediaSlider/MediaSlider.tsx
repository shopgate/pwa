import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, Swiper } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { historyPush } from '@shopgate/engage/core/actions';
import { useAppDispatch } from '@shopgate/engage/core/hooks';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { PRODUCT_MEDIA } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO } from '../../constants';
import { makeGetProductMedia } from '../../selectors/media';
import { makeGetProductFeaturedMedia } from '../../selectors/product';
import FeaturedImage from '../Media/MediaImage';
import MediaImage from './components/MediaImage';
import MediaVideo from './components/MediaVideo';

export interface ProductMedia {
  type: string;
  url: string;
  code?: string;
  altText?: string;
  title?: string;
}

export interface MediaSliderProps {
  productId: string;
  /** Shows the media of this variant instead of the product's. */
  variantId?: string | null;
  /** Media types to show, images and videos by default. */
  types?: string[];
  className?: string;
  'aria-hidden'?: boolean;
  paginationType?: string;
  swiperProps?: Record<string, unknown>;
  /** Lists the media below each other instead of sliding through them. */
  stacked?: boolean;
  /** Renders the product while it has no media, e.g. its featured image. */
  renderPlaceholder?: (featuredMedia: ProductMedia | null) => ReactNode;
}

interface MediaItemProps {
  media: ProductMedia;
  onClick: () => void;
  naturalRatio: boolean;
}

const DEFAULT_TYPES = [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE];

const useStyles = makeStyles()({
  container: {
    transform: 'translate3d(0, 0, 0)',
    position: 'relative',
  },
});

/**
 * Renders a single product media by its type.
 * @param props The component props.
 * @param props.media The media.
 * @param props.onClick Opens the gallery at this media.
 * @param props.naturalRatio Shows an image in its own shape.
 * @returns The media, or nothing for unknown types.
 */
const MediaItem = ({ media, onClick, naturalRatio }: MediaItemProps) => {
  if (media.type === MEDIA_TYPE_VIDEO) {
    return <MediaVideo media={media} />;
  }

  if (media.type === MEDIA_TYPE_IMAGE) {
    return <MediaImage media={media} onClick={onClick} naturalRatio={naturalRatio} />;
  }

  return null;
};

/**
 * Renders the featured media of a product.
 * @param featuredMedia The featured media.
 * @returns The featured image.
 */
const renderFeaturedMedia = (featuredMedia: ProductMedia | null) => (
  <FeaturedImage {...featuredMedia} />
);

/**
 * The product media slider. Clicking a media opens the gallery at it.
 * @returns The slider, the stacked media or the placeholder.
 */
const MediaSlider = ({
  productId,
  variantId,
  types = DEFAULT_TYPES,
  className,
  'aria-hidden': ariaHidden,
  paginationType,
  swiperProps,
  stacked = false,
  renderPlaceholder = renderFeaturedMedia,
}: MediaSliderProps) => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const getProductMedia = useMemo(makeGetProductMedia, []);
  const getFeaturedMedia = useMemo(makeGetProductFeaturedMedia, []);
  const media: ProductMedia[] | null = useSelector(state => getProductMedia(state, {
    productId,
    variantId,
    types,
  }));
  const featuredMedia: ProductMedia | null = useSelector(state => getFeaturedMedia(state, {
    productId,
    variantId,
  }));

  const openGallery = useCallback((index: number) => {
    dispatch(historyPush({
      pathname: `${ITEM_PATH}/${bin2hex(productId)}/gallery/${index}`,
    }));
  }, [dispatch, productId]);

  if (!media?.length) {
    return <>{renderPlaceholder(featuredMedia)}</>;
  }

  const isStacked = stacked && media.length > 1;
  const items = media.map((entry, index) => ({
    key: `${index}-${entry.url}`,
    content: (
      <MediaItem
        media={entry}
        onClick={() => openGallery(index)}
        naturalRatio={isStacked}
      />
    ),
  }));

  return (
    <div className={classes.container}>
      <SurroundPortals portalName={PRODUCT_MEDIA}>
        {isStacked ? (
          <div className={className} aria-hidden={ariaHidden} data-stacked>
            {items.map(({ key, content }) => <div key={key}>{content}</div>)}
          </div>
        ) : (
          <Swiper
            paginationType={paginationType}
            loop={media.length > 1}
            indicators
            disabled={media.length === 1}
            controls={media.some(entry => entry.type === MEDIA_TYPE_VIDEO)}
            className={className}
            aria-hidden={ariaHidden}
            {...swiperProps}
          >
            {items.map(({ key, content }) => (
              <Swiper.Item key={key}>{content}</Swiper.Item>
            ))}
          </Swiper>
        )}
      </SurroundPortals>
    </div>
  );
};

export default MediaSlider;
