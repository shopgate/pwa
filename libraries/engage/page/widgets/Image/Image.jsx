import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, ConditionalWrapper } from '@shopgate/engage/components';
import { useImageWidget } from './hooks';

const useStyles = makeStyles()(() => ({
  root: {},
  link: {},
  image: {
    width: '100%',
  },
}));
/**
 * The ImageWidget is used to display a image.
 * @returns {JSX.Element}
 */
const Image = () => {
  const { cx, classes } = useStyles();
  const { link, altText, url } = useImageWidget();

  if (!url) return null;

  return (
    <div className={cx(classes.root)}>
      <ConditionalWrapper
        condition={!!link}
        wrapper={children => (
          <Link href={link} className={cx(classes.link)}>
            {children}
          </Link>
        )}
      >
        <img
          loading="lazy"
          src={url}
          alt={altText}
          aria-label={altText}
          className={cx(classes.image)}
        />
      </ConditionalWrapper>
    </div>
  );
};
export default Image;
