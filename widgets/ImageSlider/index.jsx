import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import { Swiper } from '@shopgate/pwa-common/components';
import { image as imgStyle, link as linkStyle } from './style';

/**
 * Core image slider widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
const ImageSliderWidget = ({ settings, className }) => (
  <Swiper
    className={className}
    autoPlay={settings.autostart}
    indicators={settings.pagination}
    interval={settings.delay}
    loop={settings.loop}
  >
    {settings.images.map(({ image, alt, link }) => {
      const img = <img src={image} alt={alt} className={imgStyle} data-test-id={`link : ${settings.link}`} />;

      if (link) {
        return (
          <Swiper.Item key={image}>
            <Link href={link} className={linkStyle} data-test-id="withLink">
              {img}
            </Link>
          </Swiper.Item>
        );
      }

      return (
        <Swiper.Item key={image}>
          {img}
        </Swiper.Item>
      );
    })}
  </Swiper>
);

ImageSliderWidget.propTypes = {
  // The settings as received by the pipeline request
  settings: PropTypes.shape({
    autostart: PropTypes.bool.isRequired, // Should the slider start automatically?
    delay: PropTypes.number.isRequired, // The delay between the automatic slides
    pagination: PropTypes.bool.isRequired, // Show the pagination (dots)?
    loop: PropTypes.bool.isRequired, // Wrap the slider content when it reached the last image?
    images: PropTypes.arrayOf(( // An array of images to display
      PropTypes.shape({
        image: PropTypes.string.isRequired, // The image URL
        link: PropTypes.string, // The link to the image
        alt: PropTypes.string, // The alternative title for images that could not be loaded.
      })
    )).isRequired,
  }).isRequired,
  className: PropTypes.string, // Additional styles to append to the image slider.
};

ImageSliderWidget.defaultProps = {
  className: null,
};

export default ImageSliderWidget;
