import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarField component.
 */
class AppBarField extends PureComponent {
  static propTypes = {
    fieldRef: PropTypes.shape(),
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    fieldRef: null,
    onChange: null,
    onSubmit: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { fieldRef, onChange, onSubmit } = this.props;
    const { __ } = this.context.i18n();

    return (
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.field}
          onChange={onChange}
          placeholder={__('search.placeholder')}
          ref={fieldRef}
        />
      </form>
    );
  }
}

export default AppBarField;
