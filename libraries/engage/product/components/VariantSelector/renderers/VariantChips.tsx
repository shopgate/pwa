import { useCallback } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import CharacteristicHeading from './CharacteristicHeading';
import VariantChip from './VariantChip';
import useRadioGroupKeys from './useRadioGroupKeys';
import type { VariantRendererProps } from '../types';

const useStyles = makeStyles({ name: 'VariantChips' })(theme => ({
  root: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(2),
  },
  values: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    '&[data-layout="scroll"]': {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      margin: theme.spacing(0, -2),
      padding: theme.spacing(0, 2),
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
}));

/**
 * Renders a characteristic as a group of chips.
 * @returns The chips.
 */
const VariantChips = ({
  charRef,
  highlight,
  id,
  domId = id,
  label,
  selected,
  values,
  select,
  chipsLayout = 'wrap',
}: VariantRendererProps) => {
  const { classes, cx } = useStyles();
  const headingId = `variant-characteristic-${domId}`;
  const selectedLabel = values.find(value => value.id === selected)?.label ?? null;

  const handleSelect = useCallback((valueId: string) => {
    select({
      id,
      value: valueId,
    });
  }, [id, select]);

  const { groupRef, onKeyDown, getTabIndex } = useRadioGroupKeys(values, selected, handleSelect);

  return (
    <div className={cx(classes.root, 'engage__variant-selector__characteristic')} data-type="chips">
      <CharacteristicHeading
        charRef={charRef}
        id={headingId}
        label={label}
        selectedLabel={selectedLabel}
        highlight={highlight}
      />
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        ref={groupRef}
        role="radiogroup"
        onKeyDown={onKeyDown}
        aria-labelledby={`${headingId}-label`}
        className={cx(classes.values, 'engage__variant-selector__values')}
        data-layout={chipsLayout}
      >
        {values.map(value => (
          <VariantChip
            key={value.id}
            value={value}
            onSelect={handleSelect}
            tabIndex={getTabIndex(value.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default VariantChips;
