import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    color: themeConfig.colors.shade3,
  },
});

/**
 * The price info component
 * @param {Object} props The component props
 * @param {string} props.text The price info string e.g. 12,00 € / l
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const PriceInfo = ({ className, text }) => {
  const { classes } = useStyles();

  return (
    <div
      className={classNames(classes.root, className, 'ui-shared__price-info')}
      dangerouslySetInnerHTML={{ __html: text }}
      data-test-id={`priceInfo: ${text}`}
    />
  );
};

PriceInfo.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

PriceInfo.defaultProps = {
  className: '',
};

export default PriceInfo;
