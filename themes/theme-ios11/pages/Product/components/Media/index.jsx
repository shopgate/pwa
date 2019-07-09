import React, { Fragment, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta, useNavigation, bin2hex } from '@shopgate/engage/core';
import { MediaSlider, ProductImage, ITEM_PATH } from '@shopgate/engage/product';
import ImageSlider from './components/ImageSlider';
import connect from './connector';

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = memo((props) => {
  const {
    'aria-hidden': ariaHidden, productId, variantId, imageUrl,
  } = props;
  const { push } = useNavigation();
  const handleClick = useCallback(() => {
    push({ pathname: `${ITEM_PATH}/${bin2hex(productId)}/gallery/0` });
  }, []);

  if (imageUrl) {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleClick}
        role="button"
        tabIndex="0"
        aria-hidden={ariaHidden}
      >
        <ProductImage src={imageUrl} />
      </div>
    );
  }

  return (
    <Fragment>
      {/* MediaSlider feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects */}
      {isBeta()
        ? <MediaSlider productId={variantId || productId} aria-hidden={ariaHidden} />
        : <ImageSlider productId={productId} variantId={variantId} aria-hidden={ariaHidden} />
      }
    </Fragment>
  );
});

Media.propTypes = {
  productId: PropTypes.string.isRequired,
  'aria-hidden': PropTypes.bool,
  imageUrl: PropTypes.string,
  variantId: PropTypes.string,
};

Media.defaultProps = {
  'aria-hidden': null,
  imageUrl: null,
  variantId: null,
};

export default connect(Media);
