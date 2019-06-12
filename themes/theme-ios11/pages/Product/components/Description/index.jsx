import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_DESCRIPTION_AFTER,
  PRODUCT_DESCRIPTION_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import HtmlSanitizer from '@shopgate/pwa-common/components/HtmlSanitizer';
import I18n from '@shopgate/pwa-common/components/I18n';
import PlaceholderParagraph from '@shopgate/pwa-ui-shared/PlaceholderParagraph';
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

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const { html, navigate } = this.props;

    return (
      <Fragment>
        <Portal name={PRODUCT_DESCRIPTION_BEFORE} />
        <Portal name={PRODUCT_DESCRIPTION}>
          {(html !== '') && (
            <section className={styles.container} aria-label={__('product.sections.description')}>
              <div role="heading" className={styles.title}>
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
            </section>
          )}
        </Portal>
        <Portal name={PRODUCT_DESCRIPTION_AFTER} />
      </Fragment>
    );
  }
}

export default connect(Description);
