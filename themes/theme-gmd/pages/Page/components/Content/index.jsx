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
import { AppBar } from '@shopgate/pwa-ui-material';
import { DefaultBar, BackBar } from 'Components/AppBar/presets';
import { Logo } from '@shopgate/engage/components';
import widgets from 'Extensions/widgets';
import styles from './style';
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

  let center = <Logo key="center" />;

  if (pageId !== PAGE_ID_INDEX) {
    center = <AppBar.Title key="center" title={configs.title || ''} />;
  }

  const BarComponent = !isCookieConsentHandled ? BackBar : DefaultBar;

  return (
    <Fragment>
      <BarComponent
        center={center}
        title={configs.title || ''}
        {...!isCookieConsentHandled && { right: (<></>) }}
      />
      <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
      <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
        <div key="widgetWrapper" className={styles.widgetWrapper}>
          {(!postponeRender && configs && configs.widgets) && (
            <Widgets components={widgets} widgets={configs.widgets} />
          )}
        </div>
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
