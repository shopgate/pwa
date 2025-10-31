import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PAGE_CONTENT } from '@shopgate/engage/core/constants';
import {
  Logo,
  SurroundPortals,
  Widgets as WidgetsV1,
} from '@shopgate/engage/components';
import { PAGE_ID_INDEX } from '@shopgate/engage/page/constants';
import { NotFound, Widgets as WidgetsV2 } from '@shopgate/engage/page/components';
import { AppBar } from '@shopgate/pwa-ui-material';
import { DefaultBar, BackBar } from 'Components/AppBar/presets';
import { i18n } from '@shopgate/engage/core';
import styles from './style';
import connect from './connector';

/**
 * @param {Object} props The component props
 * @param {boolean} props.isCmsV2Enabled Whether CMS V2 is enabled.
 * @param {boolean} props.postponeRender Whether to postpone rendering the widgets.
 * @param {string} props.pageId The page id.
 * @param {string} props.title The page title.
 * @param {Array} props.widgets The page widgets.
 * @param {boolean} props.isCookieConsentHandled Whether the cookie consent is handled (pages can be
 * to show the privacy policy. We need to re-configure the screen so that users can't break out)
 * @param {boolean} props.hasError Whether the page has an error.
 * @returns {JSX.Element}
 */
function PageContent({
  isCmsV2Enabled = false,
  postponeRender = false,
  pageId = null,
  title = '',
  widgets = [],
  isCookieConsentHandled,
  hasError = false,
}) {
  let center = <Logo key="center" />;

  if (pageId !== PAGE_ID_INDEX) {
    center = <AppBar.Title title={hasError ? i18n.text('titles.page_not_found') : title} />;
  }

  const BarComponent = !isCookieConsentHandled ? BackBar : DefaultBar;
  const Component = isCmsV2Enabled ? WidgetsV2 : WidgetsV1;

  return (
    <Fragment>
      <BarComponent
        center={center}
        title={hasError ? i18n.text('titles.page_not_found') : title}
        {...!isCookieConsentHandled && { right: (<></>) }}
      />
      <SurroundPortals
        portalName={PAGE_CONTENT}
        portalProps={{ id: pageId }}
      >
        <div key="widgetWrapper" className={styles.widgetWrapper}>
          {(!postponeRender) && (
            hasError
              ? <NotFound />
              : <Component widgets={widgets} />
          )}
        </div>
      </SurroundPortals>
    </Fragment>
  );
}

PageContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  isCmsV2Enabled: PropTypes.bool,
  isCookieConsentHandled: PropTypes.bool,
  postponeRender: PropTypes.bool,
  title: PropTypes.string,
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

PageContent.defaultProps = {
  isCmsV2Enabled: false,
  postponeRender: false,
  title: '',
  widgets: [],
  isCookieConsentHandled: true,
  hasError: false,
};

export default connect(PageContent);
