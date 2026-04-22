import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import I18n from '../../../I18n';

const useStyles = makeStyles()(() => ({
  item: {
    cursor: 'pointer',
  },
}));

/**
 * The SelectBoxItem component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SelectBoxItem = ({
  handleSelectionUpdate,
  isSelected,
  label,
  value,
  wrapper: Wrapper,
  classNames: classNamesProp,
  forwardedRef,
}) => {
  const { classes, cx } = useStyles();
  const { selectItem, selectItemSelected } = classNamesProp;

  const onSelect = useCallback(() => {
    handleSelectionUpdate(value);
  }, [handleSelectionUpdate, value]);

  return (
    <li
      className={cx(classes.item, {
        [selectItemSelected]: isSelected,
        selectItem,
      })}
      onKeyUp={() => {}}
      onClick={onSelect}
      data-test-id={label}
      role="menuitem"
      ref={forwardedRef}
      tabIndex={isSelected ? '0' : '-1'}
      aria-current={isSelected}
    >
      <Wrapper>
        <I18n.Text string={label} />
      </Wrapper>
    </li>
  );
};

SelectBoxItem.propTypes = {
  handleSelectionUpdate: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  wrapper: PropTypes.func.isRequired,
  classNames: PropTypes.objectOf(PropTypes.string),
  forwardedRef: PropTypes.func,
};

SelectBoxItem.defaultProps = {
  forwardedRef: null,
  classNames: {},
};

export default memo(SelectBoxItem);
