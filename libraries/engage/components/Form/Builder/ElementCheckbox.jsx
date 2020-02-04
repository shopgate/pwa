import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX}
 */
const ElementCheckbox = (props) => {
  const {
    element,
    errorText,
    value,
    name,
  } = props;

  return (
    <div className={camelCase(name)}>
      <Checkbox
        name={name}
        errorText={errorText}
        checked={!!value}
        label={element.label}
        onChange={element.handleChange}
        translateErrorText={false}
      />
    </div>
  );
};

ElementCheckbox.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.number.isRequired,
  ]),
};

ElementCheckbox.defaultProps = {
  value: false,
};

export default memo(ElementCheckbox);
