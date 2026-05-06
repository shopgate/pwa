import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import { makeStyles } from '@shopgate/engage/styles';
import { SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_BADGES } from '../../../components/constants';

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    paddingLeft: 10,
    left: 0,
    top: 10,
    zIndex: 5,
    transform: 'translate3d(0, 0, 0)',
    display: 'flex',
    pointerEvents: 'none',
    width: '100%',
    ' > *:empty': {
      display: 'none',
    },
  },
});

/**
 * The ProductBadges component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const ProductBadges = ({
  children, location, productId, portalProps, className,
}) => {
  const { classes, cx } = useStyles();
  const props = useMemo(() => ({
    ...portalProps,
    location,
    productId,
  }), [location, portalProps, productId]);

  const locationClass = useMemo(() => {
    if (!location) {
      return '';
    }
    return `product_badges__${kebabCase(location)}`;
  }, [location]);

  return (
    <div className={cx(classes.root, className, 'product_badges', locationClass)}>
      <SurroundPortals portalName={PORTAL_PRODUCT_BADGES} portalProps={props}>
        {children}
      </SurroundPortals>
    </div>
  );
};

ProductBadges.propTypes = {
  location: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  portalProps: PropTypes.shape(),
};

ProductBadges.defaultProps = {
  portalProps: null,
  children: PropTypes.node,
  className: '',
};

export default ProductBadges;
