import type { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Image } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { getCategoryImagePlaceholder } from '@shopgate/engage/settings/selectors/shopSettings';
import type { ImageResolution } from '@shopgate/engage/settings/types/appSettings';

const useStyles = makeStyles({ name: 'CategoryImage' })(theme => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

export interface CategoryImageProps {
  src?: string | null;
  className?: string;
  /** Width and height parts of the aspect ratio. */
  ratio?: number[];
  resolutions?: ImageResolution[];
  /** Shown when there is neither an image nor a shop placeholder, or both fail to load. */
  fallback?: ReactElement | null;
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
  fallback = null,
}: CategoryImageProps) => {
  const { classes, cx } = useStyles();
  const placeholderSrc = useSelector(getCategoryImagePlaceholder) as string | null;

  if (!src && !placeholderSrc && !fallback) {
    return null;
  }

  return (
    <Image
      className={cx(classes.root, className)}
      src={src}
      ratio={ratio}
      resolutions={resolutions}
      placeholder={placeholderSrc ? <Image unwrapped src={placeholderSrc} /> : fallback}
    />
  );
};

export default CategoryImage;
