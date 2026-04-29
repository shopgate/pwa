import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, Link } from '@shopgate/engage/components';
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
 * Core image slider widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
const ImageSliderWidget = ({ settings, className }) => {
  const { classes } = useStyles();

  if (settings.images.length === 1) {
    const image = settings.images[0];
    const img = <img src={image.image} alt={image.alt} className={classes.image} data-test-id={`link : ${settings.link}`} />;

    if (image.link) {
      return (
        <div className={className}>
          <Link href={image.link} className={classes.link} data-test-id="withLink">
            {img}
          </Link>
        </div>
      );
    }
    return (
      <div className={className} aria-hidden={!image.alt}>
        {img}
      </div>
    );
  }

  return (
    <Swiper
      className={className}
      {...settings.autostart && {
        autoplay: {
          delay: settings.delay,
        },
      }}
      indicators={settings.pagination}
      loop={settings.loop}
    >
      {settings.images.map(({ image, alt, link }) => {
        const img = <img src={image} alt={alt} className={classes.image} data-test-id={`link : ${settings.link}`} />;

        if (link) {
          return (
            <Swiper.Item key={image}>
              <Link href={link} className={classes.link}>
                {img}
              </Link>
            </Swiper.Item>
          );
        }

        return (
          <Swiper.Item key={image} aria-hidden={!alt}>
            {img}
          </Swiper.Item>
        );
      })}
    </Swiper>
  );
};

ImageSliderWidget.propTypes = {
  settings: PropTypes.shape({
    autostart: PropTypes.bool.isRequired,
    delay: PropTypes.number.isRequired,
    pagination: PropTypes.bool.isRequired,
    loop: PropTypes.bool.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.string.isRequired,
      link: PropTypes.string,
      alt: PropTypes.string,
    })).isRequired,
    link: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

ImageSliderWidget.defaultProps = {
  className: '',
};

export default ImageSliderWidget;
