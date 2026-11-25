import type { ComponentType, ReactNode } from 'react';
import { Link as EngageLink } from '@shopgate/engage/components';
import { ResponsiveWidgetImage, WidgetRichText } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import WidgetHeadline from '../../components/WidgetHeadline';
import WidgetButton from '../../components/WidgetButton';
import { useImageWithTextWidget } from './hooks';

const Link = EngageLink as unknown as ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
}>;

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  imageRight: {
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row-reverse',
    },
  },
  image: {
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 50%',
    },
  },
  imageThird: {
    [theme.breakpoints.up('sm')]: {
      flexBasis: '33.333%',
    },
  },
  link: {
    display: 'block',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    flex: 1,
    minWidth: 0,
    padding: theme.spacing(2),
  },
  headline: {
    padding: 0,
  },
}));

/**
 * The ImageWithTextWidget shows an image next to a headline, a text and a button. On narrow
 * screens the image sits above the text.
 * @returns The JSX.
 */
const ImageWithText = () => {
  const {
    imageUrl,
    altText,
    imagePosition,
    imageWidth,
    headline,
    text,
    link,
    buttonText,
    buttonAlignment,
    borderRadius,
  } = useImageWithTextWidget();
  const { classes, cx } = useStyles();

  if (!imageUrl) return null;

  const image = (
    <ResponsiveWidgetImage src={imageUrl} alt={altText} borderRadius={borderRadius} />
  );
  const button = link && buttonText?.trim() ? (
    <WidgetButton text={buttonText} link={link} alignment={buttonAlignment} />
  ) : null;

  return (
    <div
      className={cx(classes.root, {
        [classes.imageRight]: imagePosition === 'right',
      }, 'widget__image-with-text')}
      data-image-position={imagePosition}
      data-image-width={imageWidth}
    >
      <div
        className={cx(classes.image, {
          [classes.imageThird]: imageWidth === 'third',
        }, 'widget__image-with-text__image')}
      >
        {link ? <Link href={link} className={classes.link}>{image}</Link> : image}
      </div>
      {headline?.text || text || button ? (
        <div className={cx(classes.body, 'widget__image-with-text__body')}>
          {headline ? <WidgetHeadline headline={headline} className={classes.headline} /> : null}
          <WidgetRichText content={text} />
          {button}
        </div>
      ) : null}
    </div>
  );
};

export default ImageWithText;
