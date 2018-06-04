import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_CONTENT_BEFORE,
  PAGE_CONTENT,
  PAGE_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import Widgets from '@shopgate/pwa-common/components/Widgets';
import widgets from 'Extensions/widgets';
import styles from './style';
import connect from './connector';

/**
 * @param {Ovject} props.configs The page configs.
 * @return {JSX}
 */
const PageContent = ({ configs, pageId }) => (
  <Fragment>
    <Portal name={PAGE_CONTENT_BEFORE} props={{ id: pageId }} />
    <Portal name={PAGE_CONTENT} props={{ id: pageId }}>
      <div className={styles.widgetWrapper}>
        {(configs && configs.widgets) && <Widgets components={widgets} widgets={configs.widgets} />}
      </div>
    </Portal>
    <Portal name={PAGE_CONTENT_AFTER} props={{ id: pageId }} />
  </Fragment>
);

PageContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  configs: PropTypes.shape(),
};

PageContent.defaultProps = {
  configs: null,
};

export default connect(PageContent);
