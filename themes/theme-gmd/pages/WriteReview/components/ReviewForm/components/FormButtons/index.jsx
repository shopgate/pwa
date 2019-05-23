import React from 'react';
import PropTypes from 'prop-types';
import { I18n, RippleButton } from '@shopgate/engage/components';
import { LoadingContext } from '@shopgate/engage/core';
import buttonStyles from '@shopgate/pwa-ui-shared/Button/style';
import styles from './style';
import connect from './connector';

/**
 * The form buttons component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormButtons = (props) => {
  const buttonStyle = buttonStyles.regular(false);
  return (
    <div className={styles.buttonLine}>
      <button
        type="button"
        className={`${buttonStyle.button} ${buttonStyle.content}`}
        onClick={props.cancel}
        data-test-id="reviewCancelButton"
      >
        <I18n.Text string="common.cancel" />
      </button>
      <RippleButton type="secondary" disabled={props.isLoading} testId="sendReviewButton">
        <I18n.Text string="common.submit" />
      </RippleButton>
    </div>
  );
};

FormButtons.propTypes = {
  cancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

FormButtons.defaultProps = {
  isLoading: false,
};

export default connect(props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <FormButtons {...props} isLoading={isLoading(props.pathname)} />
    )}
  </LoadingContext.Consumer>
));
