import React from 'react';
import PropTypes from 'prop-types';
import HtmlSanitizer from '@shopgate/pwa-common/components/HtmlSanitizer';
import I18n from '@shopgate/pwa-common/components/I18n';
import PlaceholderParagraph from '@shopgate/pwa-ui-shared/PlaceholderParagraph';
import connect from './connector';
import styles from './style';

/**
 * The product description.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Description = ({ html, navigate }) => {
  if (html === '') {
    return null;
  }

  const settings = {
    html,
    handleClick: navigate,
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <I18n.Text string="product.description_heading" />
      </div>
      <PlaceholderParagraph className={styles.placeholder} ready={!!html}>
        <div className={styles.content} data-test-id={html}>
          <HtmlSanitizer settings={settings}>
            {html}
          </HtmlSanitizer>
        </div>
      </PlaceholderParagraph>
    </div>
  );
};

Description.propTypes = {
  html: PropTypes.string,
  navigate: PropTypes.func,
};

Description.defaultProps = {
  html: null,
  navigate: () => {},
};

export default connect(Description);
