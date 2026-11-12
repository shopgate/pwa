import { i18n } from '@shopgate/engage/core/helpers';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import VideoPreview from '../VideoPreview';
import type { ProductMediaItem } from '../../types';

const useStyles = makeStyles<{ paddingTop: string }>()((_, { paddingTop }) => ({
  root: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: 0,
    paddingTop,
    border: 0,
    cursor: 'pointer',
  },
  preview: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}));

export interface VideoSlideProps {
  /** The video of the slide. */
  media: ProductMediaItem;
  /** Called when the slide is tapped. */
  onClick: () => void;
}

/**
 * A video slide of the product page slider. It shows a preview in the size of the product images,
 * so the slider stays swipeable, and leaves playback to the media viewer it opens.
 * @returns The slide.
 */
const VideoSlide = ({ media, onClick }: VideoSlideProps) => {
  const { pdp } = useProductImageSettings();
  const largest = pdp.resolutions[pdp.resolutions.length - 1];
  const [width, height] = pdp.ratio || [largest?.width, largest?.height];
  const paddingTop = width && height ? `${(height / width) * 100}%` : '100%';
  const { classes } = useStyles({ paddingTop });

  return (
    <button
      type="button"
      className={classes.root}
      aria-label={i18n.text('product.media_video')}
      onClick={onClick}
    >
      <span className={classes.preview}>
        <VideoPreview url={media.url} large />
      </span>
    </button>
  );
};

export default VideoSlide;
