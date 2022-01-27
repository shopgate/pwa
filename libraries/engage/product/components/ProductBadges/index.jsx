import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import { SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_BADGES } from '../../../components/constants';

const styles = {
  root: css({
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 5,
    transform: 'translate3d(0, 0, 0)',
    display: 'flex',
    pointerEvents: 'none',
    ' > *:empty': {
      display: 'none',
    },
  }).toString(),
};

/**
 * The ProductBadges component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ProductBadges = ({
  children, location, productId, portalProps, className,
}) => {
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
    <div className={classNames(styles.root, className, 'product_badges', locationClass)}>
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
