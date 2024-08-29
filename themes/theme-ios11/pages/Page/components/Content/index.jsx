import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import Widgets from '@shopgate/pwa-common/components/Widgets';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { DefaultBar, BackBar } from 'Components/AppBar/presets';
import { Logo } from '@shopgate/engage/components';
import widgets from 'Extensions/widgets';
import connect from './connector';

/**
 * @param {Object} props The component props
 * @param {Object} props.configs The page configs.
 * @param {string} props.pageId The page id.
 * @param {bool} props.isCookieConsentHandled Whether the cookie consent is handled (pages can be
 * to show the privacy policy. We need to re-configure the screen so that users can't break out)
 * @return {JSX}
 */
function PageContent({
  configs, pageId, postponeRender, isCookieConsentHandled,
}) {
  if (!configs) {
    return null;
  }

  let center = <Logo />;

  if (pageId !== PAGE_ID_INDEX) {
    center = <AppBar.Title title={configs.title || ''} />;
  }

  const Bar = (pageId === PAGE_ID_INDEX) ? DefaultBar : BackBar;

  return (
    <Fragment>
      <Bar
        center={center}
        title={configs.title || ''}
        {...!isCookieConsentHandled ? { right: <></> } : null}
      />
      <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
      <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
        {(!postponeRender && configs && configs.widgets) && (
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
  isCookieConsentHandled: PropTypes.bool,
  postponeRender: PropTypes.bool,
};

PageContent.defaultProps = {
  configs: null,
  postponeRender: false,
  isCookieConsentHandled: true,
};

export default connect(PageContent);
