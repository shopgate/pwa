import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import CountdownTimer from '@shopgate/pwa-common/components/CountdownTimer';
import Link from '@shopgate/pwa-common/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { ProductImage, ProductBadges, ProductName } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Discount from '../Discount';
import Price from '../Price';
import { getLiveshoppingTimeout } from './helpers';

const { colors, variables } = themeConfig;

const paneBase = {
  width: '50%',
  background: colors.light,
};

const liveshoppingCardStyle = {
  margin: '5px 15px 10px',
};

const useStyles = makeStyles()({
  image: {
    ...paneBase,
  },
  infoPane: {
    ...paneBase,
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
    fontWeight: '500',
    lineHeight: 1.15,
    marginTop: 1,
    marginBottom: variables.gap.small * 0.5,
  },
  timer: {
    fontSize: '0.875rem',
    color: 'var(--color-primary)',
    fontStyle: 'italic',
    fontWeight: 500,
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
});

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
  const { classes } = useStyles();
  const { ProductCard } = useThemeComponents();

  return (
    <ProductCard
      productId={productId}
      style={liveshoppingCardStyle}
      render={({ product, url }) => {
        const {
          featuredImageBaseUrl,
          liveshoppings,
          name,
          price,
        } = product;
        const timeout = getLiveshoppingTimeout(liveshoppings);
        const { ListImage: gridResolutions } = getProductImageSettings();

        return (
          <Link
            href={url}
            state={{ title: name }}
            className={classNames({ [classes.linkPagination]: hasPagination })}
          >
            <Grid>
              <Grid.Item className={classes.image}>
                <ProductImage
                  src={featuredImageBaseUrl}
                  resolutions={gridResolutions}
                  alt={name}
                />
              </Grid.Item>
              <Grid.Item className={classNames(classes.infoPane, {
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
