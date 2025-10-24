import React from 'react';
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
    text, backgroundImage, link, borderRadius, parallax,
  } = useHeroBannerWidget();

  const { cx, classes } = useStyles();

  return (
    <ConditionalWrapper
      condition={!!link}
      wrapper={children => (
        <Link href={link} className={cx(classes.link)}>
          {children}
        </Link>
      )}
    >
      <div className={cx(classes.content)}>
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
            isBanner
          />

        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default HeroBanner;
