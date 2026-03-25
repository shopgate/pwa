import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import Button from '@shopgate/pwa-ui-shared/Button';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  buttonLine: {
    float: 'right',
    marginTop: '14',
  },
});

/**
 * The form buttons component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormButtons = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.buttonLine}>
      <Button
        type="regular"
        wrapContent
        onClick={props.cancel}
        testId="reviewCancelButton"
        nativeType="button"
      >
        <I18n.Text string="common.cancel" />
      </Button>
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
