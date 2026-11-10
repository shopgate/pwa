import { useEffect, useState } from 'react';
import type { SwiperClass } from 'swiper/react';
import { Swiper } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { ProductImage } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import type { ProductMediaItem } from '../../types';

const THUMBNAIL_SIZE = 64;
const FOCUSABLE_ELEMENTS = 'input, select, option, textarea, video, label';

export const THUMBNAILS_INSET = '--media-thumbnails-inset';
export const THUMBNAILS_ACTIVE_COLOR = '--media-thumbnails-active-color';
export const THUMBNAILS_INACTIVE_OPACITY = '--media-thumbnails-inactive-opacity';

const useStyles = makeStyles()((theme) => {
  const { margin, borderRadius } = theme.components.productMedia;
  const inset = `var(${THUMBNAILS_INSET}, max(0px, ${theme.spacing(2)}px - ${margin}))`;

  return {
    root: {
      marginTop: theme.spacing(1),
    },
    container: {
      '&&': {
        paddingLeft: inset,
        paddingRight: inset,
      },
    },
    slide: {
      '&&': {
        width: THUMBNAIL_SIZE,
      },
    },
    item: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      padding: 0,
      border: 0,
      borderRadius,
      overflow: 'hidden',
      background: theme.palette.background.surface,
      color: theme.palette.text.secondary,
      cursor: 'pointer',
      opacity: `var(${THUMBNAILS_INACTIVE_OPACITY}, 1)`,
      transition: 'opacity 200ms',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: 'inherit',
        boxShadow: `inset 0 0 0 2px var(${THUMBNAILS_ACTIVE_COLOR}, ${theme.palette.text.primary})`,
        opacity: 0,
        transition: 'opacity 200ms',
      },
      '&[aria-current="true"], &[aria-current="true"]::after': {
        opacity: 1,
      },
    },
    image: {
      width: '100%',
    },
    play: {
      width: 32,
      height: 32,
      fill: 'currentColor',
    },
  };
});

export interface MediaThumbnailsProps {
  /** The images and videos of the slider, in display order. */
  media: ProductMediaItem[];
  /** The slider the thumbnails follow and control. */
  swiper: SwiperClass | null;
  /** Hides the thumbnails from assistive technology, like the slider they control. */
  'aria-hidden'?: boolean;
}

/**
 * A strip of thumbnails that can be dragged sideways. It marks the visible media of a slider,
 * keeps it in view and moves the slider to the media that is tapped.
 * @returns The thumbnails, or nothing for a single media.
 */
const MediaThumbnails = ({ media, swiper, 'aria-hidden': ariaHidden }: MediaThumbnailsProps) => {
  const { classes, cx } = useStyles();
  const [strip, setStrip] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!swiper) {
      return undefined;
    }

    /** Follows the visible slide. */
    const update = () => setActiveIndex(swiper.realIndex);

    update();
    swiper.on('realIndexChange', update);

    return () => {
      swiper.off('realIndexChange', update);
    };
  }, [swiper]);

  useEffect(() => {
    if (!strip || strip.destroyed) {
      return;
    }

    if (!strip.slides[activeIndex]?.classList.contains('swiper-slide-fully-visible')) {
      strip.slideTo(activeIndex);
    }
  }, [activeIndex, strip]);

  if (media.length < 2) {
    return null;
  }

  const typeCounts = {
    image: 0,
    video: 0,
  };

  return (
    <Swiper
      className={cx(classes.root, 'theme__product__media-thumbnails')}
      classNames={{ container: classes.container }}
      slidesPerView="auto"
      spaceBetween={8}
      freeMode
      watchSlidesProgress
      focusableElements={FOCUSABLE_ELEMENTS}
      onSwiper={setStrip}
      aria-hidden={ariaHidden}
    >
      {media.map((item, index) => {
        typeCounts[item.type] += 1;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Swiper.Item key={`${index}-${item.url}`} className={classes.slide}>
            <button
              type="button"
              className={cx(classes.item, 'theme__product__media-thumbnails__item')}
              data-type={item.type}
              tabIndex={ariaHidden ? -1 : undefined}
              aria-label={i18n.text(
                item.type === 'video' ? 'product.media_thumbnail_video' : 'product.media_thumbnail_image',
                { index: typeCounts[item.type] }
              )}
              aria-current={index === activeIndex}
              onClick={() => swiper?.slideToLoop(index)}
            >
              {item.type === 'video' ? (
                <svg className={classes.play} viewBox="0 0 24 24" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <ProductImage src={item.url} context="pdp" noBackground className={classes.image} />
              )}
            </button>
          </Swiper.Item>
        );
      })}
    </Swiper>
  );
};

export default MediaThumbnails;
