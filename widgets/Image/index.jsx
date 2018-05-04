import React from 'react';
import PropTypes from 'prop-types';
import Image from '@shopgate/pwa-common/components/Image';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import styles from './style';

const resolutions = [{
  width: 0,
  height: 0,
}];

/**
 * The image widget.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const ImageWidget = ({ settings }) => {
  const content = (
    <Image src={settings.image} alt={settings.alt} resolutions={resolutions} />
  );

  // Wrap a Link around the Image if needed.
  if (settings.link) {
    return (
      <Link href={settings.link} className={styles}>
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
