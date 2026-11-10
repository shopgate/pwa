import { useCallback, useEffect, useState } from 'react';
import type { DragEvent } from 'react';
import type { SwiperClass } from 'swiper/react';
import { FocusTrap } from '@shopgate/engage/a11y/components';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import {
  ConnectedReactPortal,
  CrossIcon,
  Image,
  Swiper,
  VideoPlayer,
} from '@shopgate/engage/components';
import { IconButton } from '@shopgate/engage/components/v2';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { i18n } from '@shopgate/engage/core/helpers';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import { GALLERY_SLIDER_ZOOM } from '../../../../../ProductGallery/constants';
import { useGalleryPagination } from '../../../../../ProductGallery/hooks';
import type { ProductMediaItem } from '../../types';
import MediaThumbnails, {
  THUMBNAILS_ACTIVE_COLOR, THUMBNAILS_INACTIVE_OPACITY, THUMBNAILS_INSET,
} from '../MediaThumbnails';
import { DRAG_OFFSET, DRAG_PROGRESS, useDragToDismiss } from './useDragToDismiss';

const CLOSE_DURATION = 200;
const TRANSITION = `${CLOSE_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.modal,
    color: theme.palette.common.white,
    touchAction: 'none',
    userSelect: 'none',
    animation: `${fadeIn} ${TRANSITION}`,
    transition: `opacity ${TRANSITION}`,
    '&[data-closing]': {
      opacity: 0,
      pointerEvents: 'none',
    },
    '&[data-dragging] > *': {
      transition: 'none',
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: theme.palette.common.black,
    opacity: `calc(1 - ${DRAG_PROGRESS})`,
    transition: `opacity ${TRANSITION}`,
  },
  close: {
    position: 'absolute',
    top: `calc(${theme.spacing(1)}px + ${theme.layout.safeArea.top})`,
    right: `calc(${theme.spacing(1)}px + ${theme.layout.safeArea.right})`,
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.5)',
    opacity: `calc(1 - ${DRAG_PROGRESS})`,
    transition: `opacity ${TRANSITION}`,
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transform: `translate3d(0, ${DRAG_OFFSET}, 0)`,
    transition: `transform ${TRANSITION}`,
  },
  stage: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
  },
  thumbnails: {
    flexShrink: 0,
    paddingBottom: `max(${theme.layout.safeArea.bottom}, ${theme.spacing(2)}px)`,
    [THUMBNAILS_INSET]: `${theme.spacing(2)}px`,
    [THUMBNAILS_ACTIVE_COLOR]: theme.palette.common.white,
    [THUMBNAILS_INACTIVE_OPACITY]: 0.5,
  },
  slider: {
    height: '100%',
  },
  swiperContainer: {
    height: '100%',
  },
  image: {
    position: 'relative',
    width: '100%',
  },
  video: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  videoFrame: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export interface MediaViewerProps {
  /** The images and videos to show, in display order. */
  media: ProductMediaItem[];
  /** Index of the media shown first. */
  initialIndex: number;
  /** Called with the index of the visible media once the viewer is closed. */
  onClose: (index: number) => void;
}

/**
 * Shows the product media full screen above the product page. The images can be zoomed, and a
 * vertical swipe drags the media away to close the viewer.
 * @returns The rendered component.
 */
const MediaViewer = ({ media, initialIndex, onClose }: MediaViewerProps) => {
  const { classes, cx } = useStyles();
  const { gallery } = useProductImageSettings();
  const pagination = useGalleryPagination(gallery);
  const { zoom } = (useWidgetSettings('@shopgate/engage/product/Gallery') || {}) as {
    zoom?: object;
  };
  const { thumbnails } = useProductGallerySettings();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [closing, setClosing] = useState(false);

  useTrackModalState();

  const handleSlideChange = useCallback((index: unknown) => {
    if (typeof index === 'number') {
      setActiveIndex(index);
    }
  }, []);

  const close = useCallback(() => setClosing(true), []);

  const { ref, handlers } = useDragToDismiss<HTMLDivElement>(
    close,
    () => !closing && (swiper?.zoom?.scale ?? 1) <= 1
  );

  useEffect(() => {
    /**
     * @param event The keyboard event.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(() => {
    if (!closing) {
      return undefined;
    }

    const timer = setTimeout(() => onClose(activeIndex), CLOSE_DURATION);

    return () => clearTimeout(timer);
  }, [activeIndex, closing, onClose]);

  return (
    <ConnectedReactPortal isOpened>
      <FocusTrap>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={i18n.text('product.media_viewer')}
          className={cx(classes.root, 'theme__product__media-viewer')}
          data-closing={closing || undefined}
          onDragStart={(event: DragEvent) => event.preventDefault()}
          {...handlers}
        >
          <div className={classes.backdrop} />
          <IconButton
            size="large"
            className={cx(classes.close, 'theme__product__media-viewer__close')}
            aria-label={i18n.text('common.close')}
            onClick={close}
          >
            <CrossIcon />
          </IconButton>
          <div className={classes.content}>
            <div ref={pagination.ref} className={classes.stage} style={pagination.style}>
              <Swiper
                key={pagination.paginationType}
                paginationType={pagination.paginationType}
                classNames={{ container: classes.swiperContainer }}
                className={cx(classes.slider, pagination.className)}
                initialSlide={initialIndex}
                indicators
                loop={media.length > 1}
                disabled={media.length === 1}
                zoom={{
                  ...GALLERY_SLIDER_ZOOM,
                  ...zoom,
                }}
                onSwiper={setSwiper}
                onSlideChange={handleSlideChange}
              >
                {media.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                  <Swiper.Item key={`${index}-${item.url}`}>
                    {item.type === 'video' ? (
                      <div className={classes.video}>
                        <div className={cx(classes.videoFrame, 'swiper-no-swiping')}>
                          {index === activeIndex && (
                          <VideoPlayer
                            url={item.url}
                            controls
                            width="100%"
                            height="100%"
                            className={classes.videoPlayer}
                          />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="swiper-zoom-container">
                        <Image
                          src={item.url}
                          alt={item.altText ?? ''}
                          classNameImg={classes.image}
                          resolutions={gallery.resolutions}
                          ratio={gallery.ratio}
                          backgroundColor="transparent"
                          unwrapped
                        />
                      </div>
                    )}
                  </Swiper.Item>
                ))}
              </Swiper>
            </div>
            {thumbnails && (
              <div className={classes.thumbnails}>
                <MediaThumbnails media={media} swiper={swiper} />
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </ConnectedReactPortal>
  );
};

export default MediaViewer;
