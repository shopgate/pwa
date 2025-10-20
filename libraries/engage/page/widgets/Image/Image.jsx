import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper } from '@shopgate/engage/components';
import { ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { useImageWidget } from './hooks';

const useStyles = makeStyles()({
  link: {},
  image: {
    width: '100%',
  },
});
/**
 * The ImageWidget is used to display a image.
 * @returns {JSX.Element}
 */
const Image = () => {
  const { cx, classes } = useStyles();
  const {
    link, altText, url, borderRadius, parallax,
  } = useImageWidget();

  if (!url) return null;

  return (
    <ConditionalWrapper
      condition={!!link}
      wrapper={children => (
        <Link href={link} className={cx(classes.link)}>
          {children}
        </Link>
      )}
    >
      <ResponsiveWidgetImage
        src={url}
        alt={altText}
        className={cx(classes.image)}
        borderRadius={borderRadius}
        enableParallax={parallax}
      />
    </ConditionalWrapper>
  );
};
export default Image;
