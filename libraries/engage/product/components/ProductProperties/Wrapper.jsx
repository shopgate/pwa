import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(0, 2, 2),
    marginBottom: theme.spacing(1.5),
  },
  containerDense: {
    padding: 0,
    marginBottom: 0,
  },
}));

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Wrapper = ({
  children, dense, groupName, htmlOnly,
}) => {
  const { classes, cx } = useStyles();

  return (
    <Typography
      variant="body2"
      component="div"
      className={cx('engage__product__product-property-group', {
        [classes.container]: !dense,
        [classes.containerDense]: dense,
      })}
      data-group-name={groupName.toLowerCase()}
    >
      {htmlOnly ? children : (
        <table>
          <thead />
          <tbody>
            {children}
          </tbody>
        </table>
      )}
    </Typography>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
  groupName: PropTypes.string,
  htmlOnly: PropTypes.bool,
};

Wrapper.defaultProps = {
  dense: false,
  htmlOnly: false,
  groupName: '',
};

export default React.memo(Wrapper);
