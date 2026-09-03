import * as React from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

export type ProductContentTopProps = {
  /** The product media column. */
  media: React.ReactNode;
  /** Header, quantity, options and fulfillment. */
  children: React.ReactNode;
};

const useStyles = makeStyles()(theme => ({
  root: {
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      alignItems: 'flex-start',
      display: 'flex',
      gap: theme.spacing(4),
      padding: theme.spacing(4, 2),
    },
  },
  media: {
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      alignSelf: 'flex-start',
      flex: '0 1 45%',
      maxWidth: 520,
      minWidth: 0,
      position: 'sticky',
      top: theme.spacing(2),
    },
  },
  info: {
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      flex: '1 1 0',
      minWidth: 0,
      // The cta buttons overhang the header's top edge to float over the media slider on
      // mobile. Here there is no slider above them, so the column carries the overhang.
      paddingTop: theme.spacing(5),
    },
  },
}));

/**
 * Places the product media next to the buying information on wide website viewports, and keeps
 * the plain vertical stack everywhere else.
 * @param props The component props.
 * @param props.media The product media column.
 * @param props.children The buying information column.
 * @returns The rendered section.
 */
const ProductContentTop = ({ media, children }: ProductContentTopProps) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.root, 'engage__product__content-top')}>
      <div className={cx(classes.media, 'engage__product__content-top__media')}>
        {media}
      </div>
      <div className={cx(classes.info, 'engage__product__content-top__info')}>
        {children}
      </div>
    </div>
  );
};

export default ProductContentTop;
