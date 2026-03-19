import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import noop from 'lodash/noop';
import connect from './connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
  },
  image: {
    margin: '0 auto',
    maxHeight: variables.navigator.height,
    maxWidth: `calc(var(--page-content-width) - ${(variables.navigator.height * 3) + variables.gap.xbig}px)`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

/**
 * The Logo component.
 * @return {JSX}
 */
const Logo = ({ className, onClick, showLogo }) => {
  const { classes } = useStyles();

  if (!showLogo) {
    return null;
  }

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div
      onClick={onClick}
      className={classNames(classes.container, className, 'engage__logo')}
    >
      <img
        className={classes.image}
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
