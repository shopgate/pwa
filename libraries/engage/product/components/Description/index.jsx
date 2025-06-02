import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals, PlaceholderParagraph, HtmlSanitizer, I18n,
} from '@shopgate/engage/components';
import { PRODUCT_DESCRIPTION } from '@shopgate/engage/product';
import classNames from 'classnames';
import {
  container, title, placeholder, content,
} from './style';
import connect from './connector';

/**
 * The product description.
 * @param {Object} props The component props.
 * @param {string} props.html html describing the product
 * @param {Function} props.navigate where to navigate on click
 * @returns {JSX.Element}
 */
function Description({ html, navigate, ...props }) {
  return (
    <SurroundPortals portalName={PRODUCT_DESCRIPTION} portalProps={{ html, navigate, ...props }}>
      {(html !== '') && (
        <div className={`${container} engage__product__description`}>
          <div className={classNames(title, 'theme__description_heading')}>
            <I18n.Text string="product.description_heading" />
          </div>
          <PlaceholderParagraph className={placeholder} ready={!!html}>
            <div className={content} data-test-id="description">
              <HtmlSanitizer
                settings={{
                  html,
                  handleClick: navigate,
                }}
              >
                {html}
              </HtmlSanitizer>
            </div>
          </PlaceholderParagraph>
        </div>
      )}
    </SurroundPortals>
  );
}

Description.propTypes = {
  html: PropTypes.string,
  navigate: PropTypes.func,
};

Description.defaultProps = {
  html: null,
  navigate: () => { },
};

export default connect(Description);
