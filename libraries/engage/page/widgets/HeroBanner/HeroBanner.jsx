import React from 'react';
import { ConditionalWrapper, Link } from '@shopgate/engage/components';
import { WidgetRichText, ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useHeroBannerWidget } from './hooks';

const useStyles = makeStyles()((theme, { borderRadius }) => ({
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
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    objectFit: 'cover',
    zIndex: 0,
    pointerEvents: 'none',
    borderRadius: `${borderRadius}px`,
  },
}));

/**
 * @returns {JSX.Element}
 */
const HeroBanner = () => {
  const {
    text, backgroundImage, link, borderRadius,
  } = useHeroBannerWidget();

  const { cx, classes } = useStyles({ borderRadius });

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
        <ResponsiveWidgetImage
          src={backgroundImage?.url}
          alt={backgroundImage?.alt}
          className={cx(classes.image)}
        />
      </div>
    </ConditionalWrapper>
  );
};

export default HeroBanner;
