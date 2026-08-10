import React from 'react';
import PropTypes from 'prop-types';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import CountdownTimer from '@shopgate/pwa-common/components/CountdownTimer';
import Link from '@shopgate/pwa-common/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import { useSelector } from 'react-redux';
import { ProductImage, ProductBadges, ProductName } from '@shopgate/engage/product/components';
import { getCardShadowSize } from '@shopgate/engage/settings/selectors/appSettings';
import { makeStyles, SHADOW_COLOR_VAR } from '@shopgate/engage/styles';
import Discount from '../Discount';
import Price from '../Price';
import { getLiveshoppingTimeout } from './helpers';

const useStyles = makeStyles()((theme, { size }) => ({
  // This widget renders the card content itself instead of the engage ProductCard, so it also
  // brings the card chrome that the ProductCard would otherwise draw from these tokens.
  card: {
    margin: '5px 15px 10px',
    background: theme.components.cards.backgroundColor,
    borderRadius: theme.shape.cardsBorderRadius,
    [SHADOW_COLOR_VAR]: theme.components.cards.shadowColor,
    boxShadow: theme.shadowSizes[size],
    border: theme.components.cards.border,
    overflow: 'hidden',
  },
  image: {
    width: '50%',
    background: theme.palette.background.surface,
  },
  infoPane: {
    width: '50%',
    background: theme.palette.background.surface,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoPanePagination: {
    paddingBottom: 0,
  },
  linkPagination: {
    paddingBottom: 28,
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.15,
    marginTop: 1,
    marginBottom: theme.spacing(0.5),
  },
  timer: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.primary.main,
    fontStyle: 'italic',
    fontWeight: theme.typography.fontWeightMedium,
  },
  badgesPortal: {
    width: '50%',
    '@media (min-width: 480px)': {
      position: 'initial',
      top: 'initial',
      left: 'initial',
      width: 'initial',
      marginBottom: 8,
      paddingLeft: 0,
    },
  },
}));

/**
 * The LiveShoppingItem component.
 * @param {Object} props The component props.
 * @param {string} props.productId The product id.
 * @param {boolean} [props.hasPagination=false] Whether surrounding swiper has pagination.
 * @returns {JSX.Element}
 */
function LiveshoppingItem({
  productId,
  hasPagination,
}) {
  const shadowSize = useSelector(getCardShadowSize);
  const { classes, cx } = useStyles({ size: shadowSize });
  const { ProductCard } = useThemeComponents();

  return (
    <ProductCard
      productId={productId}
      className={classes.card}
      render={({ product, url }) => {
        const {
          featuredImageBaseUrl,
          liveshoppings,
          name,
          price,
        } = product;
        const timeout = getLiveshoppingTimeout(liveshoppings);

        return (
          <Link
            href={url}
            state={{ title: name }}
            className={cx({ [classes.linkPagination]: hasPagination })}
          >
            <Grid>
              <Grid.Item className={classes.image}>
                <ProductImage
                  src={featuredImageBaseUrl}
                  context="list"
                  alt={name}
                />
              </Grid.Item>
              <Grid.Item className={cx(classes.infoPane, {
                [classes.infoPanePagination]: hasPagination,
              })}
              >
                <div data-test-id={name}>
                  <ProductBadges
                    location="liveshopping"
                    productId={productId}
                    className={classes.badgesPortal}
                  >
                    {price.discount > 0 &&
                      <Discount discount={price.discount} productId={productId} />}
                  </ProductBadges>
                  <ProductName
                    name={name}
                    className={classes.title}
                    testId={`Productname: ${name}`}
                    rows={2}
                  />
                  {timeout &&
                    <CountdownTimer className={classes.timer} timeout={timeout / 1000} />}
                </div>
                <Price price={price} />
              </Grid.Item>
            </Grid>
          </Link>
        );
      }}
    />
  );
}

LiveshoppingItem.propTypes = {
  productId: PropTypes.string.isRequired,
  hasPagination: PropTypes.bool,
};

LiveshoppingItem.defaultProps = {
  hasPagination: false,
};

export default LiveshoppingItem;
