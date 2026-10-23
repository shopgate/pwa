import { useSelector } from 'react-redux';
import { Image, PlaceholderIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { getCategoryImagePlaceholder } from '@shopgate/engage/settings/selectors/shopSettings';
import type { ImageResolution } from '@shopgate/engage/settings/types/appSettings';

const useStyles = makeStyles({ name: 'CategoryImage' })(theme => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  placeholderContent: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.common.white,
  },
  placeholderIcon: {
    width: '65% !important',
    height: '65% !important',
    color: theme.palette.background.emphasized,
  },
}));

export interface CategoryImageProps {
  src?: string | null;
  className?: string;
  /** Width and height parts of the aspect ratio. */
  ratio?: number[];
  resolutions?: ImageResolution[];
  /** Whether a placeholder icon stands in when neither the image nor the shop placeholder loads. */
  fallback?: boolean;
}

/**
 * Renders a category image, with the shop placeholder for a missing or failed image.
 * @returns The image.
 */
const CategoryImage = ({
  src = null,
  className,
  ratio,
  resolutions,
  fallback = true,
}: CategoryImageProps) => {
  const { classes, cx } = useStyles();
  const placeholderSrc = useSelector(getCategoryImagePlaceholder) as string | null;

  if (!src && !placeholderSrc && !fallback) {
    return null;
  }

  const icon = fallback ? (
    <div aria-hidden className={classes.placeholderContent}>
      <PlaceholderIcon className={classes.placeholderIcon} />
    </div>
  ) : null;

  const placeholder = placeholderSrc
    ? <Image unwrapped src={placeholderSrc} placeholder={icon} />
    : icon;

  return (
    <Image
      className={cx(classes.root, className)}
      src={src}
      ratio={ratio}
      resolutions={resolutions}
      placeholder={placeholder}
    />
  );
};

export default CategoryImage;
