import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import SafeHtml from '@shopgate/engage/components/SafeHtml';

const useStyles = makeStyles()(theme => ({
  root: {
    color: theme.palette.grey.medium,
  },
}));

/**
 * The price info component
 * @param {Object} props The component props
 * @param {string} props.text The price info string e.g. 12,00 € / l
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const PriceInfo = ({ className, text }) => {
  const { classes, cx } = useStyles();

  return (
    <SafeHtml
      className={cx(classes.root, className, 'ui-shared__price-info')}
      data-test-id={`priceInfo: ${text}`}
      html={text}
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
