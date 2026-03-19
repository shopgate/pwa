import * as React from 'react';
import PropTypes from 'prop-types';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  SurroundPortals,
  PlaceholderLabel,
  Availability as AvailableText,
} from '@shopgate/engage/components';
import { PRODUCT_AVAILABILITY } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import connect from './Availability.connector';

const useStyles = makeStyles()({
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
  availability: {
    fontSize: '0.875rem',
  },
});

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function Availability({
  availability,
  fulfillmentMethods,
  fulfillmentSelection,
  className,
}) {
  const { classes, cx } = useStyles();
  // Render only when no fulfillment methods are available or when the given method exists
  if (
    hasNewServices() &&
    (!fulfillmentMethods ||
      fulfillmentMethods.indexOf(fulfillmentSelection) !== -1)
  ) {
    return null;
  }

  const placeholderClasses = cx(classes.placeholder, className ? className.toString() : null);

  return (
    <SurroundPortals portalName={PRODUCT_AVAILABILITY} portalProps={{ availability }}>
      <PlaceholderLabel className={placeholderClasses} ready={(availability !== null)}>
        {availability && (
          <AvailableText
            className={classes.availability}
            showWhenAvailable
            text={availability.text || ''}
            state={availability.state}
          />
        )}
      </PlaceholderLabel>
    </SurroundPortals>
  );
}

Availability.propTypes = {
  availability: PropTypes.shape({
    text: PropTypes.string,
    state: PropTypes.oneOf([
      AVAILABILITY_STATE_OK,
      AVAILABILITY_STATE_WARNING,
      AVAILABILITY_STATE_ALERT,
    ]),
  }),
  className: PropTypes.string,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  fulfillmentSelection: PropTypes.string,
};

Availability.defaultProps = {
  availability: null,
  fulfillmentMethods: null,
  fulfillmentSelection: '',
  className: null,
};

export default connect(React.memo(Availability));
