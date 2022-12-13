import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';
import ErrorText from './ErrorText';

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
    visible,
  } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className={classNames('container-checkbox', camelCase(name), 'formBuilderField', { validationError: !!errorText })}>
      <Checkbox
        name={name}
        errorText={errorText}
        checked={!!value}
        label={element.label}
        onChange={element.handleChange}
        translateErrorText={false}
        showErrorText={false}
        disabled={element.disabled}
      />
      <ErrorText errorText={errorText} />
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
  visible: PropTypes.bool,
};

ElementCheckbox.defaultProps = {
  value: false,
  visible: true,
};

export default memo(ElementCheckbox);
