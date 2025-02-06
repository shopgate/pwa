import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import Icon from './components/Icon';
import styles from './style';

/**
 * The NoResults component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NoResults = props => (
  <div className={classNames(styles.wrapper, props.className, ' ui-shared__no-results')} data-test-id="noResults">
    <div className={styles.icon}>
      <Icon />
    </div>
    <div className={styles.headline} role="alert" aria-atomic="true">
      <I18n.Text string={props.headlineText} params={props} />
    </div>
    <div className={styles.text} role="alert" aria-atomic="true">
      <I18n.Text string={props.bodyText} params={props} />
    </div>
  </div>
);

NoResults.defaultProps = {
  className: null,
};

NoResults.propTypes = {
  bodyText: PropTypes.string.isRequired,
  headlineText: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default NoResults;
