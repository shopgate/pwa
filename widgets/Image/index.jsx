import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import styles from './style';

/**
 * The image widget.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const ImageWidget = ({ settings }) => {
  const content = (
    <img src={settings.image} alt={settings.alt} className={styles.image} />
  );

  // Wrap a Link around the Image if needed.
  if (settings.link) {
    return (
      <Link href={settings.link} className={styles.link}>
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
