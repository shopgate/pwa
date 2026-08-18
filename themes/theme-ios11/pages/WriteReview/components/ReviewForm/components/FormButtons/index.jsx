import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  buttonLine: {
    float: 'right',
    marginTop: 14,
    display: 'flex',
    gap: theme.spacing(1),
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
      <Button
        variant="text"
        onClick={props.cancel}
        data-test-id="reviewCancelButton"
      >
        <I18n.Text string="common.cancel" />
      </Button>
      <Button
        type="submit"
        color="primary"
        disabled={props.isLoading}
        testId="sendReviewButton"
      >
        <I18n.Text string="common.submit" />
      </Button>
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
