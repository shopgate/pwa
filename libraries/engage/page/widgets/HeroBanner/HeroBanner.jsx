import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { useHeroBannerWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    [theme.breakpoints.up('md')]: {
      minHeight: 400,
    },
  },
  html: {
    position: 'relative',
    zIndex: 2,
    padding: 16,
    '& > p:first-child': {
      marginTop: 0,
    },
    '& p': {
      marginTop: 17,
      marginBottom: 17,
    },
    'ul, ol': {
      paddingLeft: '40px',
    },
    'ul li': {
      listStyleType: 'disc',
    },
    'ol li': {
      listStyleType: 'decimal',
    },
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
  },
}));

/**
 * @returns {JSX.Element}
 */
const HeroBanner = () => {
  const { text, backgroundImage } = useHeroBannerWidget();

  const { cx, classes } = useStyles();

  if (!text) return null;

  return (
    <div className={cx(classes.root)}>
      <HtmlSanitizer
        processStyles
        settings={{ html: text }}
        className={cx(classes.html)}
      >
        {text}
      </HtmlSanitizer>
      <ResponsiveWidgetImage
        src={backgroundImage?.url}
        alt={backgroundImage?.alt}
        className={cx(classes.image)}
      />
    </div>
  );
};

export default HeroBanner;
