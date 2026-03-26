import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()(() => ({
  buttonLine: {
    float: 'right',
    marginTop: '14',
  },
  cancelButton: {
    position: 'relative',
    display: 'inline-block',
    outline: 0,
    color: colors.dark,
    backgroundColor: 'transparent',
    minWidth: 64,
    overflow: 'hidden',
    border: 0,
    ...variables.buttonBase,
    padding: `0 ${variables.gap.big}px 0`,
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
}));

/**
 * The form buttons component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormButtons = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.buttonLine}>
      <button
        type="button"
        className={classes.cancelButton}
        onClick={props.cancel}
        data-test-id="reviewCancelButton"
      >
        <I18n.Text string="common.cancel" />
      </button>
      <RippleButton
        type="secondary"
        disabled={props.isLoading}
        testId="sendReviewButton"
      >
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
