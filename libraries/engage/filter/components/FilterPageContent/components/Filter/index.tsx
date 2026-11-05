import { SurroundPortals } from '@shopgate/engage/components';
import {
  PORTAL_FILTER_PRICE_RANGE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
  PriceSlider,
} from '@shopgate/engage/filter';
import type { APIFilter } from '@shopgate/engage/filter/providers/FilterPageProvider.context';
import Selector from '../Selector';

export interface FilterProps {
  filter: APIFilter;
  /** The selected value ids, or the selected range for a range filter. */
  selected: string[] | null;
  onChange: (id: string, selected: string[]) => void;
  /** Shows the values without the surrounding accordion. */
  inline?: boolean;
}

/**
 * A single filter of the filter page: the price slider for a range filter, the value selector for
 * any other.
 * @returns The rendered component.
 */
const Filter = ({
  filter,
  selected,
  onChange,
  inline = false,
}: FilterProps) => {
  if (filter.type === FILTER_TYPE_RANGE) {
    return (
      <SurroundPortals portalName={PORTAL_FILTER_PRICE_RANGE} portalProps={{ filter }}>
        <PriceSlider
          id={filter.id}
          min={filter.minimum}
          max={filter.maximum}
          onChange={onChange}
          value={selected as unknown as number[] | null}
          inline={inline}
        />
      </SurroundPortals>
    );
  }

  return (
    <Selector
      id={filter.id}
      label={filter.label}
      values={filter.values}
      multi={filter.type === FILTER_TYPE_MULTISELECT}
      onChange={onChange}
      selected={selected}
      inline={inline}
    />
  );
};

export default Filter;
