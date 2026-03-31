import React, {
  useState, useEffect, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { VariantSwatch } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import transition from '../transition';

const { colors } = themeConfig;

const useStyles = makeStyles()(() => ({
  label: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 56,
    outline: 0,
    padding: '12px 16px',
    transition: 'background 250ms ease-in, color 250ms ease-in',
    fontWeight: 500,
    lineHeight: 1.125,
  },
  labelDisabled: {
    color: colors.shade4,
  },
  items: {
    padding: '0 16px',
    marginBottom: 16,
  },
}));

/**
 * A single characteristic swatch type.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Swatch = ({
  charRef,
  disabled,
  highlight: highlightProp,
  id,
  label,
  select,
  values,
  selected,
}) => {
  const { classes, cx } = useStyles();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(highlightProp);
  }, [highlightProp]);

  const getLabel = useCallback((charLabel) => {
    if (!selected) {
      return charLabel;
    }

    const value = values.find(val => (val.id === selected));
    return `${charLabel} - ${value.label}`;
  }, [selected, values]);

  const handleItemSelection = useCallback((valueId) => {
    select({
      id,
      value: valueId,
    });
  }, [id, select]);

  const removeHighlight = useCallback(() => {
    setHighlight(false);
  }, []);

  const swatch = {
    id,
    label,
    values,
  };

  return (
    <>
      <Transition in={highlight} timeout={500} onEntered={removeHighlight}>
        {state => (
          <div
            aria-hidden
            className={cx(classes.label, { [classes.labelDisabled]: disabled })}
            ref={charRef}
            style={transition[state]}
            data-test-id={label}
          >
            {getLabel(label)}
          </div>
        )}
      </Transition>
      <div className={classes.items}>
        <VariantSwatch swatch={swatch} onClick={handleItemSelection} />
      </div>
    </>
  );
};

Swatch.propTypes = {
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

Swatch.defaultProps = {
  selected: null,
};

export default memo(Swatch);
