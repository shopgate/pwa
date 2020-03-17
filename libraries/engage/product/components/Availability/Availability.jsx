// @flow
import * as React from 'react';
import classNames from 'classnames';
import {
  SurroundPortals,
  PlaceholderLabel,
  Availability as AvailableText,
} from '@shopgate/engage/components';
import { PRODUCT_AVAILABILITY } from '@shopgate/engage/product';
import connect from './Availability.connector';
import { placeholder, availability as availabilityStyle } from './Availability.style';
import { type OwnProps, type StateProps } from './Availability.types';

type Props = OwnProps & StateProps;

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function Availability(props: Props) {
  const {
    availability, fulfillmentMethods, fulfillmentSelection, className,
  } = props;

  // Render only when no fulfillment methods are available or when the given method exists
  if (!fulfillmentMethods || fulfillmentMethods.indexOf(fulfillmentSelection) !== -1) {
    return null;
  }

  const classes = classNames(placeholder, className ? className.toString() : null);

  return (
    <SurroundPortals portalName={PRODUCT_AVAILABILITY} portalProps={{ availability }}>
      <PlaceholderLabel className={classes} ready={(availability !== null)}>
        {availability && (
          <AvailableText
            className={availabilityStyle}
            showWhenAvailable
            text={availability.text}
            state={availability.state}
          />
        )}
      </PlaceholderLabel>
    </SurroundPortals>
  );
}

Availability.defaultProps = {
  availability: null,
  fulfillmentMethods: null,
  fulfillmentSelection: '',
  className: null,
};

export default connect(React.memo<Props>(Availability));
