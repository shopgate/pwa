import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';
import IndicatorCircle from '../IndicatorCircle';

const {
  loadingIndicator: { imgSrc: loadingImageSrc } = {},
} = themeConfig.variables;

const useStyles = makeStyles()(() => ({
  container: {
    display: 'block',
    padding: '1em',
    textAlign: 'center',
    fontSize: '1.5em',
    color: 'var(--color-secondary)',
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& img': {
      maxWidth: '50vw',
      maxHeight: '50vh',
    },
  },
}));

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = ({ className }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(
      className,
      {
        [classes.container]: !loadingImageSrc,
        [classes.imgContainer]: !!loadingImageSrc,
      },
      'loading-indicator',
      'ui-shared__loading-indicator'
    )}
    >
      { loadingImageSrc ? (
        <img src={loadingImageSrc} alt="" />
      ) : (
        <IndicatorCircle />
      )}
    </div>
  );
};

LoadingIndicator.propTypes = {
  className: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  className: null,
};

export default LoadingIndicator;
