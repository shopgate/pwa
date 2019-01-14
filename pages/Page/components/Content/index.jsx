import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
  APP_BAR_CENTER,
  APP_BAR_CENTER_BEFORE,
  APP_BAR_CENTER_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import Widgets from '@shopgate/pwa-common/components/Widgets';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { DefaultBar, BackBar } from 'Components/AppBar/presets';
import Logo from 'Components/Logo';
import widgets from 'Extensions/widgets';
import connect from './connector';

/**
 * @param {Object} props.configs The page configs.
 * @param {string} props.pageId The page id.
 * @return {JSX}
 */
function PageContent({ configs, pageId }) {
  let center = (
    <Fragment key="center">
      <Portal name={APP_BAR_CENTER_BEFORE} />
      <Portal name={APP_BAR_CENTER}>
        <Logo key="center" />
      </Portal>
      <Portal name={APP_BAR_CENTER_AFTER} />
    </Fragment>
  );

  if (pageId !== PAGE_ID_INDEX) {
    center = (
      <Fragment key="center">
        <Portal name={APP_BAR_CENTER_BEFORE} />
        <Portal name={APP_BAR_CENTER}>
          <AppBar.Title key="center" title={configs.title || ''} />
        </Portal>
        <Portal name={APP_BAR_CENTER_AFTER} />
      </Fragment>
    );
  }

  const Bar = (pageId === PAGE_ID_INDEX) ? DefaultBar : BackBar;

  return (
    <Fragment>
      <Bar center={center} />
      <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
      <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
        {(configs && configs.widgets) && (
          <Widgets components={widgets} widgets={configs.widgets} />
        )}
      </Portal>
      <Portal name={PAGE_CONTENT_AFTER} props={{ id: pageId }} />
    </Fragment>
  );
}

PageContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  configs: PropTypes.shape(),
};

PageContent.defaultProps = {
  configs: null,
};

export default connect(PageContent);
