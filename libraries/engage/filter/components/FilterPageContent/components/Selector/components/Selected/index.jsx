import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@shopgate/engage/styles';

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
    const classes = withStyles.getClasses(this.props);
    if (!this.props.selected || this.props.selected.length === 0) {
      return null;
    }

    const items = this.getItems();

    return (
      <>
        {items.map((item, index) => (
          <Fragment key={item}>
            <span className={classes.elipsed}>{item}</span>
            {(index < items.length - 1) ? <span className={classes.comma}>, </span> : ''}
          </Fragment>
        ))}
      </>
    );
  }
}

export default withStyles(
  Selected,
  () => ({
    elipsed: {
      maxWidth: '95%',
      overflow: 'hidden',
      textAlign: 'right',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    comma: {
      ' + span': {
        marginLeft: '0.65ch',
      },
    },
  })
);
