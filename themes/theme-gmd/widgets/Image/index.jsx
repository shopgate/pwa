import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  link: {
    width: '100%',
  },
  image: {
    display: 'block',
    width: '100%',
  },
});

/**
 * The image widget.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const ImageWidget = ({ settings }) => {
  const { classes } = useStyles();

  const content = (
    <img src={settings.image} alt={settings.alt} className={classes.image} data-test-id={`imageWidget: ${settings.link}`} />
  );

  if (settings.link) {
    return (
      <Link href={settings.link} className={classes.link} data-test-id="link">
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
