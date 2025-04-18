import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import Icon from './components/Icon';
import styles from './style';

/**
 * The NoResults component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const NoResults = props => (
  <div className={classNames(styles.wrapper, props.className, ' ui-shared__no-results')} data-test-id="noResults">
    <div className={styles.icon}>
      <Icon />
    </div>
    <div role="alert" aria-atomic="true">
      <div className={styles.headline}>
        <I18n.Text string={props.headlineText} params={props} />
      </div>
      <div className={styles.text}>
        <I18n.Text string={props.bodyText} params={props} />
      </div>
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
