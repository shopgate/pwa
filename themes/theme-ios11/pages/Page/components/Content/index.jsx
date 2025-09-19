import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PAGE_CONTENT } from '@shopgate/engage/core/constants';
import {
  Logo,
  SurroundPortals,
  Widgets as WidgetsV1,
} from '@shopgate/engage/components';
import { PAGE_ID_INDEX } from '@shopgate/engage/page/constants';
import { Widgets as WidgetsV2 } from '@shopgate/engage/page/components';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { DefaultBar, BackBar } from 'Components/AppBar/presets';
import connect from './connector';

/**
 * @param {Object} props The component props
 * @param {boolean} props.isCmsV2Enabled Whether CMS V2 is enabled.
 * @param {boolean} props.postponeRender Whether to postpone rendering the widgets.
 * @param {string} props.pageId The page id.
 * @param {string} props.title The page title.
 * @param {Array} props.widgets The page widgets.
 * @returns {JSX.Element}
 */
const PageContent = ({
  isCmsV2Enabled = false,
  postponeRender = false,
  pageId = null,
  title = '',
  widgets = [],
}) => {
  let center = <Logo />;

  if (pageId !== PAGE_ID_INDEX) {
    center = <AppBar.Title title={title} />;
  }

  const Bar = (pageId === PAGE_ID_INDEX) ? DefaultBar : BackBar;

  const Component = isCmsV2Enabled ? WidgetsV2 : WidgetsV1;

  return (
    <>
      <Bar center={center} title={title} />
      <SurroundPortals
        portalName={PAGE_CONTENT}
        portalProps={{ id: pageId }}
      >
        {!postponeRender && (
        <Component widgets={widgets} />
        )}
      </SurroundPortals>
    </>
  );
};

PageContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  isCmsV2Enabled: PropTypes.bool,
  postponeRender: PropTypes.bool,
  title: PropTypes.string,
  widgets: PropTypes.arrayOf(PropTypes.shape()),
};

PageContent.defaultProps = {
  isCmsV2Enabled: false,
  postponeRender: false,
  title: '',
  widgets: [],
};

export default connect(memo(PageContent));
