import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRoute, i18n } from '@shopgate/engage/core';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_BACK_BEFORE,
  APP_BAR_BACK,
  APP_BAR_BACK_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Function} goBack goBack
 * @param {string} prevTitle prev page title
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function BackBar({
  goBack, goHome, hasPrevRoute, prevTitle, ...props
}) {
  const left = <DefaultBar.Icon
    aria-label={prevTitle ? i18n.text('navigation.back', { title: prevTitle }) : i18n.text('common.back')}
    icon={ArrowIcon}
    onClick={hasPrevRoute ? goBack : goHome}
    testId="backButton"
  />;

  return (
    <>
      <Portal name={APP_BAR_BACK_BEFORE} />
      <Portal name={APP_BAR_BACK}>
        <DefaultBar left={left} {...props} />
      </Portal>
      <Portal name={APP_BAR_BACK_AFTER} />
    </>
  );
}

BackBar.propTypes = {
  goBack: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  hasPrevRoute: PropTypes.bool,
  prevTitle: PropTypes.string,
};
BackBar.defaultProps = {
  hasPrevRoute: true,
  prevTitle: null,
};
export default withRoute(connect(BackBar), { prop: 'route' });
