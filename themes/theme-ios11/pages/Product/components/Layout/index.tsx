import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { makeStyles, useActiveBreakpoint } from '@shopgate/engage/styles';
import { ActiveBreakpointContext } from '@shopgate/engage/styles/theme/providers/ActiveBreakpointProvider';

export const MEDIA_COLUMN_WIDTH = '50%';

export const MEDIA_COLUMN_HEIGHT = 'calc(var(--vh-100) - var(--app-bar-height, 0px) - var(--tabbar-height, 0px))';

const PAGE_BOTTOM_SPACE = 'calc(var(--page-content-offset-bottom, 0px) + var(--keyboard-height, 0px))';

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
      marginBottom: `calc(-1 * ${PAGE_BOTTOM_SPACE})`,
    },
  },
}));

/**
 * Stacks the product media above the product information, and places them side by side from the
 * md breakpoint on. Responsive values inside the product information resolve against its width.
 * @param props The component props.
 * @param props.media The product media.
 * @param props.children The product information.
 * @returns The layout.
 */
const ProductLayout = ({ media, children }: ProductLayoutProps) => {
  const { classes, cx, theme } = useStyles();
  const infoRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(infoRef, { includeWidth: true });
  const viewportBreakpoint = useActiveBreakpoint();
  // Determine largest fitting breakpoint
  const infoBreakpoint = width
    ? theme.breakpoints.keys.filter(key => theme.breakpoints.values[key] <= width).pop()
    : viewportBreakpoint;

  return (
    <div className={cx(classes.root, 'theme__product__layout')}>
      <div className={cx(classes.media, 'theme__product__layout__media')}>
        {media}
      </div>
      <div ref={infoRef} className="theme__product__layout__info">
        <ActiveBreakpointContext.Provider value={infoBreakpoint}>
          {children}
        </ActiveBreakpointContext.Provider>
      </div>
    </div>
  );
};

export default ProductLayout;
