import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { HtmlSanitizer } from '@shopgate/engage/components';
import styles from './style';
import connect from './connector';

const { variables } = themeConfig;

/**
 * The custom HTML widget.
 * @param {Object} props.settings The widget settings.
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX}
 */
const Html = ({ settings, navigate }) => {
  const { html } = settings;

  return (
    <div
      style={{
        ...(settings.defaultPadding && { padding: variables.gap.big }),
      }}
    >
      <HtmlSanitizer
        className={styles}
        decode
        processStyles
        settings={{
          html,
          handleClick: navigate,
        }}
      >
        {html}
      </HtmlSanitizer>
    </div>
  );
};

Html.propTypes = {
  navigate: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    defaultPadding: PropTypes.bool.isRequired,
    html: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(Html);

export { Html as UnwrappedHtml };
