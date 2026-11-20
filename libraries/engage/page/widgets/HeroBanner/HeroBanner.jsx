import React, { useCallback, useState, useMemo } from 'react';
import { ConditionalWrapper, Link } from '@shopgate/engage/components';
import { WidgetRichText, ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useHeroBannerWidget } from './hooks';
import WidgetVideo from '../../components/WidgetVideo';
import WidgetButton from '../../components/WidgetButton';

const useStyles = makeStyles()(theme => ({
  link: {
    width: '100%',
  },
  content: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: 300,
    [theme.breakpoints.up('md')]: {
      minHeight: 400,
    },
    overflow: 'hidden',
  },
  body: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    '&:first-child': {
      marginTop: 0,
    },
  },
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
}));

/**
 * @returns {JSX.Element}
 */
const HeroBanner = () => {
  const {
    text,
    altText,
    link,
    buttonText,
    buttonAlignment = 'left',
    borderRadius,
    parallax,
    imageFit = 'fillAndCrop',
    mediaType,
    mediaUrl,
  } = useHeroBannerWidget();

  const { classes } = useStyles();
  const [aspectRatio, setAspectRatio] = useState(null);

  const contentStyle = useMemo(() => {
    if (imageFit !== 'showFull') {
      return null;
    }

    return {
      aspectRatio,
      minHeight: 'unset',
    };
  }, [aspectRatio, imageFit]);

  const handleImageRatioChange = useCallback((ratio) => {
    setAspectRatio(ratio);
  }, []);

  const showButton = !!buttonText?.trim() && !!link;

  return (
    <ConditionalWrapper
      condition={!!link && !showButton}
      wrapper={children => (
        <Link href={link} className={classes.link}>
          {children}
        </Link>
      )}
    >
      <div className={classes.content} style={contentStyle}>
        {text || showButton ? (
          <div className={classes.body}>
            <WidgetRichText content={text} />
            {showButton ? (
              <WidgetButton
                text={buttonText}
                link={link}
                alignment={buttonAlignment}
                className={classes.button}
              />
            ) : null}
          </div>
        ) : null}
        <div className={classes.imageContainer}>
          {mediaType === 'image' ? (
            <ResponsiveWidgetImage
              src={mediaUrl}
              alt={altText}
              borderRadius={borderRadius}
              enableParallax={parallax}
              isBanner={imageFit === 'fillAndCrop'}
              onImageRatioChange={handleImageRatioChange}
            />
          ) : null}
          {mediaType === 'video' ? (
            <WidgetVideo isBanner url={mediaUrl} borderRadius={borderRadius} />
          ) : null}
        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default HeroBanner;
