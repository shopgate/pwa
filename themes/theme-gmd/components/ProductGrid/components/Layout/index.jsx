import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()((_theme, { columns }) => {
  const grid = {
    [responsiveMediaQuery('<=xs')]: {
      '&:not(:empty)': {
        paddingBottom: 2,
      },
    },
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: variables.gap.big,
    },
    background: 'var(--page-background-color)',
  };

  if (columns <= 2) {
    Object.assign(grid, {
      '& > *': {
        padding: 2,
        width: `${100 / columns}%`,
        [`&:nth-of-type(${columns}n)`]: {
          paddingRight: 0,
        },
        [`&:nth-of-type(${columns}n+1)`]: {
          paddingLeft: 0,
        },
        [`&:nth-of-type(-n+${columns})`]: {
          paddingTop: 0,
        },
        [responsiveMediaQuery('>xs', { webOnly: true })]: {
          '&:nth-of-type(even)': {
            padding: `0 0 ${variables.gap.big}px ${variables.gap.small}px`,
          },
          '&:nth-of-type(odd)': {
            padding: `0 ${variables.gap.small}px ${variables.gap.big}px 0`,
          },
          '&:nth-of-type(2n+1):nth-last-of-type(-n+2), &:nth-of-type(2n+1):nth-last-of-type(-n+2) ~ li': {
            paddingBottom: 0,
          },
        },
      },
    });
  } else {
    Object.assign(grid, {
      display: 'grid',
      gridGap: '4px',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    });
  }

  return { grid };
});

/**
 * The product grid layout component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Layout = ({ children, columns }) => {
  const { classes } = useStyles({ columns });

  return (
    <Grid wrap className={classes.grid} data-test-id="productGrid">
      {children}
    </Grid>
  );
};

Layout.propTypes = {
  columns: PropTypes.number.isRequired,
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
