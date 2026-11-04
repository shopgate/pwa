import type { ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

export const MEDIA_COLUMN_WIDTH = '50%';

export const MEDIA_COLUMN_HEIGHT = 'calc(var(--vh-100) - var(--app-bar-height, 0px) - var(--tabbar-height, 0px))';

export interface ProductLayoutProps {
  /** The product media, shown as a sticky column on wide screens. */
  media: ReactNode;
  children: ReactNode;
}

const useStyles = makeStyles()(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: `${MEDIA_COLUMN_WIDTH} minmax(0, 1fr)`,
      alignItems: 'start',
    },
  },
  media: {
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: MEDIA_COLUMN_HEIGHT,
    },
  },
}));

/**
 * Stacks the product media above the product information, and places them side by side from the
 * md breakpoint on.
 * @param props The component props.
 * @param props.media The product media.
 * @param props.children The product information.
 * @returns The layout.
 */
const ProductLayout = ({ media, children }: ProductLayoutProps) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.root, 'theme__product__layout')}>
      <div className={cx(classes.media, 'theme__product__layout__media')}>
        {media}
      </div>
      <div className="theme__product__layout__info">
        {children}
      </div>
    </div>
  );
};

export default ProductLayout;
