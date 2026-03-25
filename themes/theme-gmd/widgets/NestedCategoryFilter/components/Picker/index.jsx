import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import Sheet from './components/Sheet';
import connect from './connector';

const useStyles = makeStyles()(() => ({
  button: {
    background: 'var(--color-background-accent)',
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
}));

/**
 * Category picker component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const CategoryPicker = ({
  fetchCategory,
  onSelect,
  categoryId,
  label,
  selectedId,
  subcategories,
}) => {
  const { classes, cx } = useStyles();
  const [sheet, setSheet] = useState(false);

  const disabled = useMemo(() => (
    !Array.isArray(subcategories) || subcategories.length === 0 || categoryId === null
  ), [subcategories, categoryId]);

  useEffect(() => {
    if (categoryId !== null && subcategories === null) {
      fetchCategory(categoryId);
    }
  }, [categoryId, subcategories, fetchCategory]);

  const getPickerLabel = useCallback((defaultLabel) => {
    if (!selectedId || !subcategories) {
      return defaultLabel;
    }
    const subcategory = subcategories.find(val => val.id === selectedId);
    return subcategory ? subcategory.name : defaultLabel;
  }, [selectedId, subcategories]);

  const closeSheet = useCallback(() => setSheet(false), []);

  const handlePickerClick = useCallback((event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setSheet(true);
  }, [disabled]);

  const handleSheetSelect = useCallback((subcategoryId) => {
    const subcategory = subcategories.find(item => item.id === subcategoryId);
    onSelect(categoryId, subcategory);
    closeSheet();
  }, [categoryId, subcategories, onSelect, closeSheet]);

  const buttonLabel = getPickerLabel(i18n.text('common.please_choose'));
  const pickerClasses = cx(classes.button, disabled && classes.buttonDisabled);

  return (
    <>
      <div
        aria-hidden
        data-test-id="nested-picker-trigger"
        aria-disabled={disabled}
        onClick={handlePickerClick}
        className={pickerClasses}
      >
        {label && <div className={classes.label} data-test-id="nested-picker-label">{label}</div>}
        <div className={classes.selection} data-test-id="nested-picker-selection">{buttonLabel}</div>
      </div>
      <Sheet
        items={subcategories || []}
        onSelect={handleSheetSelect}
        onClose={closeSheet}
        open={sheet}
        selectedId={selectedId}
        label={label}
      />
    </>
  );
};

CategoryPicker.propTypes = {
  fetchCategory: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  label: PropTypes.string,
  selectedId: PropTypes.string,
  subcategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
};

CategoryPicker.defaultProps = {
  categoryId: null,
  label: '',
  selectedId: null,
  subcategories: null,
};

export default connect(CategoryPicker);
