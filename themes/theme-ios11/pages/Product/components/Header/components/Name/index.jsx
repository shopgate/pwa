import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import {
  PRODUCT_NAME,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { SurroundPortals } from '@shopgate/engage/components';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Content = ({ name, longName }) => (
  <div className={`${styles.name} product-name`} role="heading">
    {/* This feature is currently in BETA testing.
        It should only be used for approved BETA Client Projects */}
    { isBeta()
      ? (
        <PlaceholderLabel className={styles.placeholder} ready={(longName !== null)}>
          <span data-test-id={`name: ${longName}`}>
            { longName }
          </span>
        </PlaceholderLabel>
      )
      : (
        <PlaceholderLabel className={styles.placeholder} ready={(name !== null)}>
          <span data-test-id={`name: ${name}`}>
            {name}
          </span>
        </PlaceholderLabel>
      )
    }
  </div>
);
Content.propTypes = {
  longName: PropTypes.string,
  name: PropTypes.string,
};

Content.defaultProps = {
  longName: null,
  name: null,
};

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Name = props => (
  <SurroundPortals portalName={PRODUCT_NAME} portalProps={props}>
    <Content {...props} />
  </SurroundPortals>
);

Name.propTypes = {
  longName: PropTypes.string,
  name: PropTypes.string,
};

Name.defaultProps = {
  longName: null,
  name: null,
};

export default connect(memo(Name));
