import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal, I18n, HtmlSanitizer, PlaceholderParagraph } from '@shopgate/engage/components';
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_DESCRIPTION_AFTER,
  PRODUCT_DESCRIPTION_BEFORE,
} from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The product description.
 */
class Description extends PureComponent {
  static propTypes = {
    html: PropTypes.string,
    navigate: PropTypes.func,
  };

  static defaultProps = {
    html: null,
    navigate: () => { },
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { html, navigate } = this.props;

    return (
      <Fragment>
        <Portal name={PRODUCT_DESCRIPTION_BEFORE} />
        <Portal name={PRODUCT_DESCRIPTION}>
          {(html !== '') && (
            <div className={styles.container}>
              <div className={styles.title}>
                <I18n.Text string="product.description_heading" />
              </div>
              <PlaceholderParagraph className={styles.placeholder} ready={!!html}>
                <div className={styles.content} data-test-id="description">
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
        </Portal>
        <Portal name={PRODUCT_DESCRIPTION_AFTER} />
      </Fragment>
    );
  }
}

export default connect(Description);
