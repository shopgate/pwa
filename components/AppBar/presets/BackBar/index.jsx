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
function BackBar({ goBack, prevTitle, ...props }) {
  const left = <DefaultBar.Icon
    aria-label={i18n.text('navigation.back', { title: prevTitle })}
    icon={ArrowIcon}
    onClick={goBack}
    testId="backButton"
  />;

  return (
    <Fragment>
      <Portal name={APP_BAR_BACK_BEFORE} />
      <Portal name={APP_BAR_BACK}>
        <DefaultBar left={left} {...props} />
      </Portal>
      <Portal name={APP_BAR_BACK_AFTER} />
    </Fragment>
  );
}

BackBar.propTypes = {
  goBack: PropTypes.func.isRequired,
  prevTitle: PropTypes.string.isRequired,
};

export default withRoute(connect(BackBar), { prop: 'route' });
