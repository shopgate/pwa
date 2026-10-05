import React, { useCallback } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import CharacteristicHeading from './CharacteristicHeading';
import VariantChip from './VariantChip';
import type { VariantRendererProps } from '../types';

const useStyles = makeStyles({ name: 'VariantChips' })({
  root: {
    padding: '0 16px',
    marginBottom: 16,
  },
  values: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    '&[data-layout="scroll"]': {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      margin: '0 -16px',
      padding: '0 16px',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
});

/**
 * Renders a characteristic as a group of chips.
 * @param props The renderer props.
 * @returns The chips.
 */
const VariantChips = ({
  charRef,
  highlight,
  id,
  label,
  selected,
  values,
  select,
  chipsLayout = 'wrap',
}: VariantRendererProps) => {
  const { classes, cx } = useStyles();
  const headingId = `variant-characteristic-${id}`;
  const selectedLabel = values.find(value => value.id === selected)?.label ?? null;

  const handleSelect = useCallback((valueId: string) => {
    select({ id, value: valueId });
  }, [id, select]);

  return (
    <div className={cx(classes.root, 'engage__variant-selector__characteristic')} data-type="chips">
      <CharacteristicHeading
        charRef={charRef}
        id={headingId}
        label={label}
        selectedLabel={selectedLabel}
        highlight={highlight}
      />
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className={cx(classes.values, 'engage__variant-selector__values')}
        data-layout={chipsLayout}
      >
        {values.map(value => (
          <VariantChip key={value.id} value={value} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};

export default VariantChips;
