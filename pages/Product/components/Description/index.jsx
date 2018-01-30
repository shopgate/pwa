/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import HtmlSanitizer from '@shopgate/pwa-common/components/HtmlSanitizer';
import I18n from '@shopgate/pwa-common/components/I18n';
import PlaceholderParagraph from 'Components/PlaceholderParagraph';
import connect from './connector';
import styles from './style';

/**
 * The Product Description component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Description = ({ html }) => {
  if (html === '') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <I18n.Text string="product.description_heading" />
      </div>
      <PlaceholderParagraph className={styles.placeholder} ready={!!html}>
        <div className={styles.content}>
          <HtmlSanitizer settings={{ html }}>
            {html}
          </HtmlSanitizer>
        </div>
      </PlaceholderParagraph>
    </div>
  );
};

Description.propTypes = {
  html: PropTypes.string,
};

Description.defaultProps = {
  html: null,
};

export default connect(Description);
