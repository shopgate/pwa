import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  label: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
    order: 3,
  },
  labelWithSuffix: {
    paddingRight: theme.spacing(1),
  },
}));

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Label = ({
  label, showSeparator, labelParams, suffix,
}) => {
  const { classes, cx } = useStyles();

  if (!label) {
    return <div className={classes.label} />;
  }

  return (
    <div className={classes.label}>
      <I18n.Text
        string={label}
        params={labelParams}
        className={cx({
          [classes.labelWithSuffix]: !!suffix,
        })}
      />
      {suffix}
      {`${showSeparator ? ':' : ''}`}
    </div>
  );
};

Label.propTypes = {
  label: PropTypes.string,
  labelParams: PropTypes.shape(),
  showSeparator: PropTypes.bool,
  suffix: PropTypes.node,
};

Label.defaultProps = {
  label: null,
  suffix: null,
  showSeparator: true,
  labelParams: {},
};

export default Label;
