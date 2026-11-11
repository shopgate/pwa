import { i18n } from '@shopgate/engage/core/helpers';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import VideoPreview from '../VideoPreview';
import type { ProductMediaItem } from '../../types';

const useStyles = makeStyles<{ aspectRatio: string }>()((_, { aspectRatio }) => ({
  root: {
    display: 'block',
    width: '100%',
    aspectRatio,
    padding: 0,
    border: 0,
    cursor: 'pointer',
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
  const largest = pdp.resolutions.at(-1);
  const [width, height] = pdp.ratio || [largest?.width, largest?.height];
  const { classes } = useStyles({ aspectRatio: width && height ? `${width} / ${height}` : '1' });

  return (
    <button
      type="button"
      className={classes.root}
      aria-label={i18n.text('product.media_video')}
      onClick={onClick}
    >
      <VideoPreview url={media.url} large />
    </button>
  );
};

export default VideoSlide;
