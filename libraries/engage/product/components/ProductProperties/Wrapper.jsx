import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap } = {} } = themeConfig;

const useStyles = makeStyles()({
  container: {
    fontSize: '0.875rem',
    padding: `0 ${gap.big}px ${gap.big}px`,
    marginBottom: gap.small * 1.5,
  },
  containerDense: {
    padding: 0,
    marginBottom: 0,
  },
});

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Wrapper = ({
  children, dense, groupName, htmlOnly,
}) => {
  const { classes } = useStyles();

  return (
    <div
      className={cxs('engage__product__product-property-group', {
        [classes.container]: !dense,
        [classes.containerDense]: dense,
      })}
      data-group-name={groupName.toLowerCase()}
    >
      { htmlOnly ? children : (
        <table>
          <thead />
          <tbody>
            {children}
          </tbody>
        </table>
      )}
    </div>
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
