import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as styles from './style';

/**
 * The filter selected component.
 */
class Selected extends PureComponent {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    selected: null,
  };

  /**
   * @returns {Array}
   */
  getItems() {
    const { selected, values } = this.props;

    return values.reduce((prevValues, value) => {
      if (selected.includes(value.id)) {
        prevValues.push(value.label);
      }

      return prevValues;
    }, []);
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.selected || this.props.selected.length === 0) {
      return null;
    }

    const items = this.getItems();

    return (
      <Fragment>
        {items.map((item, index) => (
          <Fragment key={item}>
            <span className={styles.elipsed}>{item}</span>
            {(index < items.length - 1) ? <span className={styles.comma}>, </span> : ''}
          </Fragment>
        ))}
      </Fragment>
    );
  }
}

export default Selected;
