import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { MediaImage as Image } from '../../../Media';

const useStyles = makeStyles()({
  full: {
    width: '100%',
    height: '100%',
    transform: 'translate3d(0, 0, 0)',
  },
});

/**
 * The product media video slide component.
 * @returns {JSX}
 */
const MediaImage = ({ media, onClick }) => {
  const { classes } = useStyles();

  const { pdp } = useProductImageSettings();

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
      className={classes.full}
    >
      <Image
        url={media.url}
        altText={media.altText}
        resolutions={pdp.resolutions}
        ratio={pdp.ratio}
      />
    </div>
  );
};

MediaImage.propTypes = {
  media: PropTypes.shape({
    altText: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

MediaImage.displayName = 'MediaSliderImage';

export default MediaImage;
