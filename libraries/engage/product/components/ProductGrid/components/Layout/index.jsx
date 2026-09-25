import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((theme, { columns }) => ({
  root: {
    padding: '0 16px',
    ':not(:empty)': {
      marginTop: 16,
      marginBottom: 16,
    },
    ...(columns <= 2 ? {
      rowGap: 16,
      '& > *': {
        padding: '0px 8px',
        width: `${100 / columns}%`,
        [`&:nth-of-type(${columns}n)`]: {
          paddingRight: 0,
        },
        [`&:nth-of-type(${columns}n+1)`]: {
          paddingLeft: 0,
        },
      },
    } : {
      display: 'grid',
      gridGap: 16,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    }),
  },
}));

/**
 * The product grid layout component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Layout = ({ children, columns, className }) => {
  const { classes, cx } = useStyles({ columns });

  return (
    <Grid wrap className={cx(classes.root, className, 'theme__product-grid')} data-test-id="productGrid">
      {children}
    </Grid>
  );
};

Layout.propTypes = {
  columns: PropTypes.number.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

Layout.defaultProps = {
  className: null,
  children: null,
};

export default Layout;
