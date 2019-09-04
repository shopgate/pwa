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
const ImageSliderWidget = ({ settings, className }) => {
  // If only one image, don't show a swiper.
  if (settings.images.length === 1) {
    const image = settings.images[0];
    const img = <img src={image.image} alt={image.alt} className={imgStyle} data-test-id={`link : ${settings.link}`} />;

    if (image.link) {
      return (
        <div className={className}>
          <Link href={image.link} className={linkStyle} data-test-id="withLink">
            {img}
          </Link>
        </div>
      );
    }
    return (
      <div className={className}>
        {img}
      </div>
    );
  }

  // Show swiper for more than one image.
  return (
    <Swiper
      className={className}
      autoPlay={settings.autostart}
      indicators={settings.pagination}
      interval={settings.delay}
      loop={settings.loop}
    >
      {settings.images.map(({ image, alt, link }) => {
        const img = <img src={image} alt={alt} className={imgStyle} data-test-id={`link: ${link}`} />;

        if (link) {
          return (
            <Swiper.Item key={image}>
              <Link href={link} className={linkStyle}>
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
};

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
    link: PropTypes.string,
  }).isRequired,
  className: PropTypes.string, // Additional styles to append to the image slider.
};

ImageSliderWidget.defaultProps = {
  className: null,
};

export default ImageSliderWidget;
