import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core/hocs';
import { withStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';

const { colors } = themeConfig;

/**
 * The SheetItem component.
 */
class SheetItem extends PureComponent {
  static propTypes = {
    characteristics: PropTypes.shape().isRequired,
    item: PropTypes.shape().isRequired,
    classes: PropTypes.shape({
      bottomRow: PropTypes.string,
      button: PropTypes.string,
      buttonDisabled: PropTypes.string,
      mainRow: PropTypes.string,
      mainRowRight: PropTypes.string,
      root: PropTypes.string,
      rootSelected: PropTypes.string,
    }),
    forwardedRef: PropTypes.shape(),
    onClick: PropTypes.func,
    rightComponent: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    classes: {
      bottomRow: '',
      button: '',
      buttonDisabled: '',
      mainRow: '',
      mainRowRight: '',
      root: '',
      rootSelected: '',
    },
    forwardedRef: null,
    onClick() { },
    rightComponent: null,
    selected: false,
  };

  /**
   * @param {boolean} selectable Whether or not the item can be selected.
   * @returns {string}
   */
  getStyle = (selectable) => {
    const classes = withStyles.getClasses(this.props);

    if (!selectable) {
      return classes.buttonDisabled;
    }

    return classes.button;
  };

  /**
   * @returns {Object}
   */
  buildProps = () => {
    const {
      item, onClick, forwardedRef,
    } = this.props;

    return {
      className: `${this.getStyle(item.selectable).toString()} theme__product__characteristic__option`,
      key: item.id,
      ref: forwardedRef,
      value: item.id,
      'aria-hidden': !item.selectable,
      ...item.selectable && { onClick: event => onClick(event, item.id) },
    };
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      item,
      rightComponent: Right,
      selected,
      characteristics,
    } = this.props;
    const classes = withStyles.getClasses(this.props);

    return (
      <div className={classNames(classes.root, {
        [classes.rootSelected]: selected,
      })}
      >
        <button {...this.buildProps()} data-test-id={item.label} aria-selected={selected} role="option" type="button">
          <div className={classes.mainRow}>
            <div>
              {item.label}
            </div>
            <div className={classes.mainRowRight}>
              {item.selectable && <Right />}
            </div>
          </div>
        </button>
        <div className={classes.bottomRow}>
          {item.selectable && (
          <CharacteristicsButton characteristics={characteristics} />
          )}
        </div>
      </div>
    );
  }
}

export default withForwardedRef(withStyles(
  SheetItem,
  () => ({
    button: {
      outline: 0,
      textAlign: 'left',
      paddingLeft: 0,
      paddingRight: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      color: 'var(--color-text-high-emphasis)',
    },
    buttonDisabled: {
      outline: 0,
      textAlign: 'left',
      paddingLeft: 0,
      paddingRight: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      color: colors.shade4,
    },
    root: {
      padding: '16px 0',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        padding: '8px 16px',
      },
    },
    rootSelected: {
      outline: 0,
      textAlign: 'left',
      paddingLeft: 0,
      paddingRight: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      color: 'var(--color-text-high-emphasis)',
      background: 'var(--color-background-accent)',
      boxShadow: '-16px 0 0 var(--color-background-accent), 16px 0 0 var(--color-background-accent)',
      margin: '-1px 0',
      paddingTop: 17,
      paddingBottom: 17,
      fontWeight: 500,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        margin: 0,
        paddingTop: 8,
        paddingBottom: 8,
        padding: '8px 16px',
        boxShadow: 'none',
      },
    },
    mainRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px 8px',
      justifyContent: 'space-between',
      width: '100%',
    },
    mainRowRight: {
      marginLeft: 'auto',
    },
    bottomRow: {
      '&:not(:empty)': {
        textAlign: 'right',
      },
    },
  })
));
