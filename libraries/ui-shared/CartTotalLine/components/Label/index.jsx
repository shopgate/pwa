import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  label: {
    flexGrow: 1,
    paddingRight: variables.gap.small,
    order: 3,
  },
  labelWithSuffix: {
    paddingRight: variables.gap.small,
  },
});

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Label = ({
  label, showSeparator, labelParams, suffix,
}) => {
  const { classes } = useStyles();

  if (!label) {
    return <div className={classes.label} />;
  }

  return (
    <div className={classes.label}>
      <I18n.Text
        string={label}
        params={labelParams}
        className={classNames({
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
