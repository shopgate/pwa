import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals, PlaceholderParagraph, HtmlSanitizer, I18n,
} from '@shopgate/engage/components';
import { PRODUCT_DESCRIPTION } from '@shopgate/engage/product';
import {
  container, title, placeholder, content,
} from './style';
import connect from './connector';

/**
 * The product description.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Description({ html, navigate }) {
  return (
    <SurroundPortals portalName={PRODUCT_DESCRIPTION}>
      {(html !== '') && (
        <div className={container}>
          <div aria-hidden className={title}>
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
