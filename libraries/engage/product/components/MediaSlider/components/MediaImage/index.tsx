import { makeStyles } from '@shopgate/engage/styles';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { MediaImage as Image } from '../../../Media';

export interface MediaImageProps {
  media: {
    url: string;
    altText?: string;
  };
  onClick: () => void;
  /** Shows the image in its own shape instead of the configured ratio. */
  naturalRatio?: boolean;
}

const useStyles = makeStyles()({
  full: {
    width: '100%',
    height: '100%',
    transform: 'translate3d(0, 0, 0)',
  },
});

/**
 * An image of the product media slider.
 * @returns The image.
 */
const MediaImage = ({ media, onClick, naturalRatio = false }: MediaImageProps) => {
  const { classes } = useStyles();
  const { pdp } = useProductImageSettings();

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      className={classes.full}
    >
      <Image
        url={media.url}
        altText={media.altText}
        resolutions={pdp.resolutions}
        ratio={pdp.ratio}
        naturalRatio={naturalRatio}
      />
    </div>
  );
};

export default MediaImage;
