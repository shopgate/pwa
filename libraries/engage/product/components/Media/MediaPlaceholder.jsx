import React from 'react';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { defaultProps, propTypes } from './props';

const placeholderIconScale = 0.65;

const useStyles = makeStyles()({
  placeholderContainer: {
    position: 'relative',
    width: '100%',
    ':before': {
      display: 'block',
      content: '""',
      width: '100%',
      paddingTop: '100%',
    },
  },
  placeholderContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    textAlign: 'center',
  },
  placeholderIcon: {
    position: 'absolute',
    width: `${placeholderIconScale * 100}% !important`,
    height: `${placeholderIconScale * 100}% !important`,
    top: `${(1.0 - placeholderIconScale) * 50}%`,
    left: `${(1.0 - placeholderIconScale) * 50}%`,
    color: themeColors.placeholder,
  },
});

/**
 * The media placeholder component.
 * @returns {JSX}
 */
const MediaPlaceholder = ({ className }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.placeholderContainer, className)}>
      <div className={classes.placeholderContent} data-test-id="placeHolder">
        <PlaceholderIcon className={classes.placeholderIcon} />
      </div>
    </div>
  );
};

MediaPlaceholder.propTypes = {
  className: propTypes.className,
};
MediaPlaceholder.defaultProps = {
  className: defaultProps.className,
};

export default MediaPlaceholder;
