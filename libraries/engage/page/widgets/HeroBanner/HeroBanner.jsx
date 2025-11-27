import React, { useCallback, useState, useMemo } from 'react';
import { ConditionalWrapper, Link } from '@shopgate/engage/components';
import { WidgetRichText, ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useHeroBannerWidget } from './hooks';

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
  richText: {
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(2),
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
    text, backgroundImage, link, borderRadius, parallax, imageFit = 'fillAndCrop',
  } = useHeroBannerWidget();

  const { cx, classes } = useStyles();
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

  return (
    <ConditionalWrapper
      condition={!!link}
      wrapper={children => (
        <Link href={link} className={cx(classes.link)}>
          {children}
        </Link>
      )}
    >
      <div className={cx(classes.content)} style={contentStyle}>
        <WidgetRichText
          content={text}
          className={cx(classes.richText)}
        />
        <div className={cx(classes.imageContainer)}>
          <ResponsiveWidgetImage
            src={backgroundImage?.url}
            alt={backgroundImage?.alt}
            borderRadius={borderRadius}
            enableParallax={parallax}
            isBanner={imageFit === 'fillAndCrop'}
            onImageRatioChange={handleImageRatioChange}
          />

        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default HeroBanner;
