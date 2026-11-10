import { useCallback, useState } from 'react';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import type { ReviewMediaItem } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewMediaViewer from './ReviewMediaViewer';

const THUMBNAIL_SIZE = 64;

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1.25),
  },
  thumbnail: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: 0,
    border: 0,
    borderRadius: 6,
    overflow: 'hidden',
    background: theme.components.border.light,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  video: {
    background: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

/**
 * Whether an attachment can be displayed.
 * @param item An attachment from the pipeline.
 * @returns True for an image or video with a url.
 */
const isDisplayable = (item?: ReviewMediaItem | null): item is ReviewMediaItem => (
  !!item && !!item.url && (item.type === 'image' || item.type === 'video')
);

type ReviewMediaViewerState = {
  media: ReviewMediaItem[];
  index: number;
};

export interface ReviewMediaProps {
  /** The attachments of a review, in the order returned by the pipeline. */
  media?: ReviewMediaItem[];
}

/**
 * Displays the image and video attachments of a review as thumbnails that open enlarged.
 * @returns The rendered component.
 */
const ReviewMedia = ({ media }: ReviewMediaProps) => {
  const { classes, cx } = useStyles();
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const [viewer, setViewer] = useState<ReviewMediaViewerState | null>(null);

  const handleClose = useCallback(() => setViewer(null), []);

  const items = (media || []).filter(isDisplayable).filter(item => !failedUrls.includes(item.url));

  if (items.length === 0 && !viewer) {
    return null;
  }

  const typeCounts = {
    image: 0,
    video: 0,
  };

  return (
    <div className={cx(classes.root, 'engage__reviews__review-media')}>
      {items.map((item, index) => {
        typeCounts[item.type] += 1;

        return (
          <ButtonBase
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-${item.url}`}
            className={cx(classes.thumbnail, {
              [classes.video]: item.type === 'video',
            }, 'engage__reviews__review-media__item')}
            data-type={item.type}
            aria-label={i18n.text(
              item.type === 'video' ? 'reviews.media_video' : 'reviews.media_image',
              { index: typeCounts[item.type] }
            )}
            onClick={(event) => {
              event.currentTarget.focus();
              setViewer({
                media: items,
                index,
              });
            }}
          >
            {item.type === 'video' ? (
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <img
                src={item.url}
                alt=""
                loading="lazy"
                className={classes.image}
                onError={() => setFailedUrls(urls => [...urls, item.url])}
              />
            )}
          </ButtonBase>
        );
      })}
      {viewer && (
        <ReviewMediaViewer media={viewer.media} initialIndex={viewer.index} onClose={handleClose} />
      )}
    </div>
  );
};

export default ReviewMedia;
