import React, { useCallback } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import CharacteristicHeading from './CharacteristicHeading';
import { getValueStateText } from './valueState';
import VariantChip from './VariantChip';
import type { VariantRendererProps, VariantSelectorValue } from '../types';

const useStyles = makeStyles({ name: 'VariantSwatches' })(theme => ({
  root: {
    padding: '0 16px',
    marginBottom: 16,
  },
  values: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  swatch: {
    position: 'relative',
    width: 40,
    height: 40,
    padding: 0,
    border: `1px solid ${theme.components.border.medium}`,
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    outline: 0,
    overflow: 'hidden',
    '&[data-shape="square"]': {
      borderRadius: theme.shape.borderRadius,
    },
    '&[aria-checked="true"]': {
      borderWidth: 2,
      borderColor: theme.palette.primary.main,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
    '&[data-unavailable]': {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: theme.palette.text.secondary,
    },
    '&[data-sold-out]': {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to top right, transparent calc(50% - 1.5px), ${theme.palette.text.primary} calc(50% - 1.5px), ${theme.palette.text.primary} calc(50% + 1.5px), transparent calc(50% + 1.5px))`,
      },
    },
    '&[aria-disabled="true"]': {
      cursor: 'default',
    },
  },
}));

/**
 * Renders a characteristic as color or image swatches. Values without swatch are shown as chips.
 * @param props The renderer props.
 * @returns The swatches.
 */
const VariantSwatches = ({
  charRef,
  highlight,
  id,
  label,
  selected,
  values,
  select,
  swatchShape = 'round',
  swatchImageZoom = 100,
}: VariantRendererProps) => {
  const { classes, cx } = useStyles();
  const headingId = `variant-characteristic-${id}`;
  const selectedLabel = values.find(value => value.id === selected)?.label ?? null;

  const handleSelect = useCallback((valueId: string) => {
    select({ id, value: valueId });
  }, [id, select]);

  const renderSwatch = (value: VariantSelectorValue) => {
    if (!value.swatch?.color && !value.swatch?.imageUrl) {
      return (
        <VariantChip key={value.id} value={value} onSelect={handleSelect} />
      );
    }

    return (
      <button
        key={value.id}
        type="button"
        role="radio"
        aria-checked={value.selected}
        aria-disabled={!value.selectable}
        aria-label={getValueStateText(value) ? `${value.label}, ${getValueStateText(value)}` : value.label}
        className={cx(classes.swatch, 'engage__variant-selector__swatch')}
        data-unavailable={value.available === false ? true : undefined}
        data-sold-out={value.soldOut ? true : undefined}
        data-shape={swatchShape}
        data-test-id={value.label}
        style={{
          ...(value.swatch.color && { backgroundColor: value.swatch.color }),
          ...(value.swatch.imageUrl && {
            backgroundImage: `url("${value.swatch.imageUrl}")`,
            backgroundSize: swatchImageZoom > 100 ? `${swatchImageZoom}%` : 'cover',
          }),
        }}
        onClick={() => {
          if (value.selectable) {
            handleSelect(value.id);
          }
        }}
      />
    );
  };

  return (
    <div className={cx(classes.root, 'engage__variant-selector__characteristic')} data-type="swatches">
      <CharacteristicHeading
        charRef={charRef}
        id={headingId}
        label={label}
        selectedLabel={selectedLabel}
        highlight={highlight}
      />
      <div
        role="radiogroup"
        aria-labelledby={`${headingId}-label`}
        className={cx(classes.values, 'engage__variant-selector__values')}
      >
        {values.map(renderSwatch)}
      </div>
    </div>
  );
};

export default VariantSwatches;
