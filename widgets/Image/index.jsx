import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import Link from '@shopgate/pwa-common/components/Link';
import styles from './style';

/**
 * The image widget.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const ImageWidget = ({ settings }) => {
  const content = (
    <img src={settings.image} alt={settings.alt} className={styles.image} data-test-id={`imageWidget: ${settings.link}`} />
  );

  // Wrap a Link around the Image if needed.
  if (settings.link) {
    return (
      <Link href={settings.link} className={styles.link} data-test-id="link">
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

export default shouldUpdate((prev, next) => (!prev.settings && next.settings))(ImageWidget);
