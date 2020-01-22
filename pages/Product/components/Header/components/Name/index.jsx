import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import Portal from '@shopgate/pwa-common/components/Portal';
import { PRODUCT_NAME, PRODUCT_NAME_AFTER, PRODUCT_NAME_BEFORE } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import connect from './connector';
import styles from './style';

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Name = ({ longName, name }) => (
  <Fragment>
    <Portal name={PRODUCT_NAME_BEFORE} />
    <Portal name={PRODUCT_NAME}>
      <div className={styles.name} role="heading">
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
    </Portal>
    <Portal name={PRODUCT_NAME_AFTER} />
  </Fragment>
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
