import React, {
  useState, useEffect, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import { ResponsiveContainer, ArrowDropIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import Sheet from './components/Sheet';
import transition from '../transition';

const useStyles = makeStyles()(() => ({
  button: {
    background: 'var(--color-background-accent)',
    color: 'var(--color-text-high-emphasis)',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 56,
    outline: 0,
    padding: '12px 16px',
    marginBottom: 8,
    transition: 'background 250ms ease-in, color 250ms ease-in',
  },
  buttonDisabled: {
    color: `${themeColors.shade4} !important`,
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
  arrow: {
    position: 'absolute',
    right: 32,
    fontSize: 20,
  },
}));

/**
 * A single characteristic.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Characteristic = ({
  charRef,
  disabled,
  highlight: highlightProp,
  id,
  label: displayLabel,
  select,
  values,
  selected,
}) => {
  const { classes } = useStyles();
  const [highlight, setHighlight] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    setHighlight(highlightProp);
  }, [highlightProp]);

  const getButtonLabel = useCallback((defaultLabel) => {
    if (!selected) {
      return defaultLabel;
    }

    const value = values.find(val => (val.id === selected));

    return value.label;
  }, [selected, values]);

  const handleButtonClick = useCallback((event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setSheet(true);
  }, [disabled]);

  const handleItemSelection = useCallback((valueId) => {
    select({
      id,
      value: valueId,
    });

    setSheet(false);
  }, [id, select]);

  const closeSheet = useCallback(() => {
    setSheet(false);
  }, []);

  const sheetDidClose = useCallback(() => {
    if (charRef && charRef.current) {
      charRef.current.focus();
    }
  }, [charRef]);

  const removeHighlight = useCallback(() => {
    setHighlight(false);
  }, []);

  const translatedLabel = i18n.text('product.pick_an_attribute', [displayLabel]);

  const transitionRenderer = useCallback((state) => {
    const buttonLabel = getButtonLabel(translatedLabel);
    const buttonClasses = classNames(
      classes.button,
      { [classes.buttonDisabled]: disabled },
      'theme__product__characteristic'
    );

    return (
      <div
        role="button"
        aria-disabled={disabled}
        aria-haspopup={!disabled}
        tabIndex={0}
        className={buttonClasses}
        onClick={handleButtonClick}
        onKeyDown={() => { }}
        ref={charRef}
        style={transition[state]}
        data-test-id={displayLabel}
      >
        {selected && <div className={`${classes.label} theme__product__characteristic__label`}>{displayLabel}</div>}
        <div
          className={`${classes.selection} theme__product__characteristic__selection`}
          {...selected && { 'data-selected': true }}
        >
          {buttonLabel}
        </div>
        <ResponsiveContainer breakpoint=">xs" webOnly>
          <div className={classes.arrow}>
            <ArrowDropIcon />
          </div>
        </ResponsiveContainer>
      </div>
    );
  }, [
    charRef,
    classes.arrow,
    classes.button,
    classes.buttonDisabled,
    classes.label,
    classes.selection,
    disabled,
    displayLabel,
    getButtonLabel,
    handleButtonClick,
    selected,
    translatedLabel,
  ]);

  return (
    <>
      <Transition in={highlight} timeout={500} onEntered={removeHighlight}>
        {transitionRenderer}
      </Transition>
      <Sheet
        charId={id}
        contextRef={charRef}
        items={values}
        label={translatedLabel}
        onClose={closeSheet}
        onDidClose={sheetDidClose}
        onSelect={handleItemSelection}
        open={sheet}
        selectedValue={selected}
      />
    </>
  );
};

Characteristic.propTypes = {
  charRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape(),
  ]).isRequired,
  disabled: PropTypes.bool.isRequired,
  highlight: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selected: PropTypes.string,
};

Characteristic.defaultProps = {
  selected: null,
};

export default memo(Characteristic);
