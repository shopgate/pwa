import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import CountdownTimer from '@shopgate/pwa-common/components/CountdownTimer';
import Link from '@shopgate/pwa-common/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import { getProductImageSettings, ProductImage, ProductBadges } from '@shopgate/engage/product';
import Discount from '../Discount';
import Price from '../Price';
import { getLiveshoppingTimeout } from './helpers';
import styles from './style';

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
  const { ProductCard } = useThemeComponents();

  return (
    <ProductCard
      productId={productId}
      style={styles.card}
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
            className={classNames({ [styles.linkPagination]: hasPagination })}
          >
            <Grid>
              <Grid.Item className={styles.image}>
                <ProductImage
                  src={featuredImageBaseUrl}
                  resolutions={gridResolutions}
                  alt={name}
                />
              </Grid.Item>
              <Grid.Item className={classNames(styles.infoPane, {
                [styles.infoPanePagination]: hasPagination,
              })}
              >
                <div data-test-id={name}>
                  <ProductBadges
                    location="liveshopping"
                    productId={productId}
                    className={styles.badgesPortal}
                  >
                    {price.discount > 0 &&
                    <Discount discount={price.discount} productId={productId} />
                      }
                  </ProductBadges>
                  <ProductCard.Content.Title title={name} style={styles.title} />
                  {timeout &&
                  <CountdownTimer className={styles.timer} timeout={timeout / 1000} />
                      }
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
