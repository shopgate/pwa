import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import noop from 'lodash/noop';
import styles from './style';
import connect from './connector';

/**
 * The Logo component.
 * @return {JSX}
 */
const Logo = ({ className, onClick, showLogo }) => {
  if (!showLogo) {
    return null;
  }

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div
      onClick={onClick}
      className={classNames(styles.container, className, 'engage__logo')}
    >
      <img
        className={styles.image}
        src={appConfig.logo || appConfig.logoFallback}
        alt={appConfig.shopName}
      />
    </div>
    /* eslint-enable jsx-a11y/no-static-element-interactions */
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  showLogo: PropTypes.bool,
};

Logo.defaultProps = {
  className: '',
  onClick: noop,
  showLogo: true,
};

export default connect(Logo);
