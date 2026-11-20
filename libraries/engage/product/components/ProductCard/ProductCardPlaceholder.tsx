import type { CSSProperties, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import Card from '@shopgate/engage/components/Card';
import { Placeholder } from '@shopgate/engage/components';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import {
  getProductActionButtons,
  getProductCardNameMaxLines,
  getProductTileNameMaxLines,
} from '@shopgate/engage/settings/selectors/appSettings';

const useStyles = makeStyles<{ isTile: boolean }>({ name: 'ProductCardPlaceholder' })((theme, { isTile }) => {
  const { tiles, productCard } = theme.components;
  const tokens = isTile ? tiles : productCard;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: tokens.padding,
      ...(isTile && {
        background: tiles.backgroundColor,
        border: tiles.border,
        borderRadius: tiles.borderRadius,
      }),
    },
    image: {
      padding: tokens.imagePadding,
    },
    imageRatio: {
      position: 'relative',
      '& > .ui-shared__placeholder': {
        position: 'absolute',
      },
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: tokens.textPadding,
      paddingTop: tokens.textPaddingTop,
    },
    cartButton: {
      marginTop: 'auto',
      padding: tokens.textPadding,
      paddingTop: `max(0px, calc(8px - ${tokens.textPadding}))`,
    },
  };
});

/**
 * Props of the {@link ProductCardPlaceholder} component.
 */
export interface ProductCardPlaceholderProps {
  /**
   * Whether the placeholder stands in for a product card or a product grid tile.
   */
  variant?: 'card' | 'tile';
  /**
   * Leaves out the lines of the product name.
   */
  hideName?: boolean;
  /**
   * Leaves out the line of the price.
   */
  hidePrice?: boolean;
  /**
   * Style of the card, as the product slider passes it to its items.
   */
  style?: CSSProperties;
}

/**
 * Stands in for a product card or a product grid tile while its product loads, in the same size.
 */
const ProductCardPlaceholder = ({
  variant = 'card',
  hideName = false,
  hidePrice = false,
  style,
}: ProductCardPlaceholderProps): ReactElement => {
  const isTile = variant === 'tile';
  const { classes, cx } = useStyles({ isTile });
  const { typography } = useTheme();
  const nameLines: number = useSelector(
    isTile ? getProductTileNameMaxLines : getProductCardNameMaxLines
  );
  const { addToCart } = useSelector(getProductActionButtons);
  const { ratio, resolutions } = useProductImageSettings().list;
  const largest = resolutions[resolutions.length - 1];
  const [width, height] = ratio ?? [largest.width, largest.height];

  const content = (
    <>
      <div className={classes.image}>
        <div className={classes.imageRatio} style={{ paddingTop: `${(height / width) * 100}%` }}>
          <Placeholder width="100%" height="100%" />
        </div>
      </div>
      {(!hideName || !hidePrice) && (
        <div className={classes.details}>
          {!hideName && Array.from({ length: nameLines }, (_, line) => (
            <Placeholder
              key={line}
              width={line === nameLines - 1 ? '60%' : '90%'}
              height={`calc(${typography.body2.fontSize} * 1.15)`}
            />
          ))}
          {!hidePrice && (
            <Placeholder width="40%" height={`calc(${typography.body1.fontSize} * 1.2)`} />
          )}
        </div>
      )}
      {addToCart === 'button' && (
        <div className={classes.cartButton}>
          <Placeholder width="100%" height={32} />
        </div>
      )}
    </>
  );

  if (isTile) {
    return (
      <div className={cx(classes.root, 'engage__product-card__placeholder')} data-variant="tile">
        {content}
      </div>
    );
  }

  return (
    <Card className={cx(classes.root, 'engage__product-card__placeholder')} style={style}>
      {content}
    </Card>
  );
};

export default ProductCardPlaceholder;
