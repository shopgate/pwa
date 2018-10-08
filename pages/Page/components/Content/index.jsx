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
import { DefaultBar } from 'Components/AppBar/presets';
import Logo from 'Components/Logo';
import widgets from 'Extensions/widgets';
import styles from './style';
import connect from './connector';

/**
 * @param {Object} props.configs The page configs.
 * @param {string} props.pageId The page id.
 * @return {JSX}
 */
function PageContent({ configs, pageId }) {
  const center = (pageId === PAGE_ID_INDEX) ? <Logo /> : <AppBar.Title title={configs.title} />;
  return (
    <Fragment>
      <DefaultBar center={center} />
      <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
      <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
        <div className={styles.widgetWrapper}>
          {(configs && configs.widgets) && (
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
};

PageContent.defaultProps = {
  configs: null,
};

export default connect(PageContent);
