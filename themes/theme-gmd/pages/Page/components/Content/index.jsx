import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Portal,
  AppBarAndroid as AppBar,
  Widgets,
} from '@shopgate/engage/components';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
} from '@shopgate/engage/core';
import { PAGE_ID_INDEX } from '@shopgate/engage/page';
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
  if (!configs) {
    return null;
  }

  let center = <Logo key="center" />;

  if (pageId !== PAGE_ID_INDEX) {
    center = <AppBar.Title key="center" title={configs.title || ''} />;
  }

  return (
    <Fragment>
      <DefaultBar center={center} />
      <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
      <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
        <div key="widgetWrapper" className={styles.widgetWrapper}>
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
