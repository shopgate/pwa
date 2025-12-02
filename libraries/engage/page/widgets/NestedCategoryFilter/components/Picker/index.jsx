import React, {
  useCallback, useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategory } from '@shopgate/engage/category';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import Sheet from './components/Sheet';
import { getCategoriesById } from '../../../CategoryList/selectors';

const useStyles = makeStyles()({
  button: {
    background: `var(--color-background-accent, ${themeColors.overlay})`,
    color: 'var(--color-text-high-emphasis)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 56,
    outline: 0,
    padding: '12px 16px',
    marginBottom: 8,
    transition: 'background 250ms ease-in, color 250ms ease-in',
    cursor: 'pointer',
  },
  buttonDisabled: {
    color: themeColors.shade4,
    cursor: 'not-allowed',
  },
  label: {
    fontSize: 12,
    marginTop: -2,
    marginBottom: 4,
  },
  selection: {
    fontWeight: 500,
    lineHeight: 1.125,
  },
});

/**
 * The CategoryPicker component.
 * @param {Object} props The component props.
 * @param {Function} props.onSelect The selection handler.
 * @param {string} props.categoryId The categoryId for which to show subcategories.
 * @param {string} props.label The label for the picker.
 * @param {string|null} props.selectedId The currently selected subcategoryId.
 * @return {JSX.Element}
 */
const CategoryPicker = ({
  onSelect,
  categoryId,
  label,
  selectedId,
}) => {
  const subcategories = useSelector(state => getCategoriesById(state, { categoryId }));
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const hasSubcategories = Array.isArray(subcategories) && subcategories.length > 0;
  const disabled = !hasSubcategories || categoryId === null;

  useEffect(() => {
    if (categoryId !== null && subcategories === null) {
      dispatch(fetchCategory(categoryId));
    }
  }, [categoryId, dispatch, subcategories]);

  const buttonLabel = useMemo(() => {
    if (!selectedId) {
      return i18n.text('common.please_choose');
    }

    const subcategory = subcategories?.find(val => (val.id === selectedId));

    return subcategory?.name;
  }, [selectedId, subcategories]);

  const closeSheet = useCallback(() => {
    setSheetIsOpen(false);
  }, []);

  const handlePickerClick = useCallback((event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setSheetIsOpen(true);
  }, [disabled]);

  const handleSheetSelect = useCallback((subcategoryId) => {
    const subcategory = subcategories.find(item => item.id === subcategoryId);
    onSelect(categoryId, subcategory);
    closeSheet();
  }, [categoryId, closeSheet, onSelect, subcategories]);

  return (
    <>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        onClick={handlePickerClick}
        className={classNames(classes.button, { [classes.buttonDisabled]: disabled })}
      >
        {label && <div className={classes.label}>{label}</div>}
        <div className={classes.selection}>{buttonLabel}</div>
      </div>
      <Sheet
        items={subcategories || []}
        onSelect={handleSheetSelect}
        onClose={closeSheet}
        open={sheetIsOpen}
        selectedId={selectedId}
        label={label}
      />
    </>
  );
};

CategoryPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  label: PropTypes.string,
  selectedId: PropTypes.string,
};

CategoryPicker.defaultProps = {
  categoryId: null,
  label: '',
  selectedId: null,
};

export default CategoryPicker;
