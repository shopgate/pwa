import { useCallback, useEffect, useState } from 'react';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import { FocusTrap } from '@shopgate/engage/a11y/components';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import { ConnectedReactPortal, Swiper, VideoPlayer } from '@shopgate/engage/components';
import { IconButton } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import type { ReviewMediaItem } from '@shopgate/pwa-common-commerce/reviews/types/reviews';

const CLOSE_AREA_HEIGHT = 64;
const PAGINATION_AREA_HEIGHT = 40;

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.modal,
    background: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  close: {
    position: 'absolute',
    top: `calc(${theme.spacing(1)}px + ${theme.layout.safeArea.top})`,
    right: `calc(${theme.spacing(1)}px + ${theme.layout.safeArea.right})`,
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.5)',
  },
  slider: {
    height: '100%',
    '--swiper-pagination-bottom': `max(${theme.layout.safeArea.bottom}, 8px)`,
  },
  swiperContainer: {
    height: '100%',
    '&& .swiper-pagination-bullet': {
      background: theme.palette.common.white,
    },
  },
  video: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    height: '100%',
    paddingTop: `calc(${CLOSE_AREA_HEIGHT}px + ${theme.layout.safeArea.top})`,
    paddingBottom: `calc(${PAGINATION_AREA_HEIGHT}px + ${theme.layout.safeArea.bottom})`,
  },
  videoPlayer: {
    width: '100%',
    '& video': {
      display: 'block',
      maxHeight: [
        `calc(100vh - ${CLOSE_AREA_HEIGHT + PAGINATION_AREA_HEIGHT}px)`,
        `calc(100dvh - ${CLOSE_AREA_HEIGHT + PAGINATION_AREA_HEIGHT}px - ${theme.layout.safeArea.top} - ${theme.layout.safeArea.bottom})`,
      ],
    },
  },
}));

export interface ReviewMediaViewerProps {
  /** The attachments to show, in display order. */
  media: ReviewMediaItem[];
  /** Index of the attachment shown first. */
  initialIndex: number;
  /** Called when the viewer is closed. */
  onClose: () => void;
}

/**
 * Shows review attachments enlarged in a full screen slider.
 * @returns The rendered component.
 */
const ReviewMediaViewer = ({ media, initialIndex, onClose }: ReviewMediaViewerProps) => {
  const { classes, cx } = useStyles();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useTrackModalState();

  const handleSlideChange = useCallback((index: unknown) => {
    if (typeof index === 'number') {
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    /**
     * @param event The keyboard event.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <ConnectedReactPortal isOpened>
      <FocusTrap>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={i18n.text('reviews.media_viewer')}
          className={cx(classes.root, 'engage__reviews__review-media-viewer')}
        >
          <IconButton
            size="large"
            className={classes.close}
            aria-label={i18n.text('common.close')}
            onClick={onClose}
          >
            <CrossIcon />
          </IconButton>
          <Swiper
            className={classes.slider}
            classNames={{ container: classes.swiperContainer }}
            initialSlide={initialIndex}
            indicators
            disabled={media.length === 1}
            zoom={{ maxRatio: 4 }}
            onSlideChange={handleSlideChange}
          >
            {media.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Swiper.Item key={`${index}-${item.url}`}>
                {item.type === 'video' ? (
                  <div className={classes.video}>
                    <div className={cx(classes.videoPlayer, 'swiper-no-swiping')}>
                      {index === activeIndex && (
                        <VideoPlayer url={item.url} controls width="100%" height="auto" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="swiper-zoom-container">
                    <img src={item.url} alt="" />
                  </div>
                )}
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
      </FocusTrap>
    </ConnectedReactPortal>
  );
};

export default ReviewMediaViewer;
