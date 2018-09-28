import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarField component.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
function AppBarField(props, context) {
  const {
    fieldRef, onChange, onSubmit, value,
  } = props;
  const { __ } = context.i18n();

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.field}
        onChange={onChange}
        placeholder={__('search.placeholder')}
        ref={fieldRef}
        value={value}
      />
    </form>
  );
}

AppBarField.propTypes = {
  fieldRef: PropTypes.shape(),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.string,
};

AppBarField.defaultProps = {
  fieldRef: null,
  onChange: null,
  onSubmit: null,
  value: '',
};

AppBarField.contextTypes = {
  i18n: PropTypes.func,
};

export default AppBarField;
