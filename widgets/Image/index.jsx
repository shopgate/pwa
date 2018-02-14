/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Image from '@shopgate/pwa-common/components/Image';
import styles from './style';

/**
 * The image widget.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const ImageWidget = (props) => {
  let content = (
    <Image
      ratio={props.ratio}
      src={props.settings.image}
      alt={props.settings.alt}
    />
  );

  // Wrap a Link around the Image if needed.
  if (props.settings.link) {
    content = (
      <Link href={props.settings.link} className={styles}>
        {content}
      </Link>
    );
  }

  return content;
};

ImageWidget.propTypes = {
  settings: PropTypes.shape({
    alt: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

export default ImageWidget;
