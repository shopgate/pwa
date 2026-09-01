import {
  useState, useEffect, useCallback, useMemo, memo,
} from 'react';
import noop from 'lodash/noop';
import { Accordion, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { FilterItem } from '@shopgate/engage/filter';
import { PORTAL_FILTER_SELECTOR } from '@shopgate/engage/filter/constants';
import ValueCheckbox from './components/ValueCheckbox';
import Toggle from './components/Toggle';
import Selected from './components/Selected';

const useStyles = makeStyles()(theme => ({
  accordion: {
    overflow: 'hidden',
  },
  chevron: {
    alignSelf: 'flex-start',
  },
  content: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

/**
 * Formats selected filter value labels into a readable enumeration.
 * @param labels Labels of the selected values.
 * @returns The formatted enumeration.
 */
const formatSelectedLabels = (labels: string[]): string => {
  const { ListFormat } = Intl as typeof Intl & {
    ListFormat?: new (locales?: string) => { format(list: string[]): string };
  };

  if (typeof ListFormat !== 'function') {
    return labels.join(', ');
  }

  return new ListFormat(i18n.getLang()).format(labels);
};

export interface FilterValue {
  /**
   * Id of the filter value.
   */
  id: string;
  /**
   * Display label of the filter value.
   */
  label: string;
  /**
   * Number of products available for the filter value.
   */
  hits?: number;
}

export interface SelectorProps {
  /**
   * Id of the filter.
   */
  id: string;
  /**
   * Display label of the filter.
   */
  label: string;
  /**
   * The selectable values of the filter.
   */
  values: FilterValue[];
  /**
   * Whether multiple values can be selected at once.
   */
  multi?: boolean;
  /**
   * Invoked with the filter id and the updated selection whenever a value is toggled.
   */
  onChange?: (id: string, selected: string[]) => void;
  /**
   * The currently selected value ids.
   */
  selected?: string[] | null;
}

/**
 * The selector component renders a single filter as an accordion with selectable values.
 * @returns The rendered component.
 */
const Selector = ({
  id,
  label,
  values,
  multi = false,
  onChange = noop,
  selected: selectedFromProps = null,
}: SelectorProps) => {
  const { classes } = useStyles();
  const [selected, setSelected] = useState<string[]>(() => selectedFromProps || []);

  useEffect(() => {
    setSelected(selectedFromProps || []);
  }, [selectedFromProps]);

  const handleToggle = useCallback((value: string) => {
    setSelected((prev) => {
      let newSelected = [...prev, value];

      if (!multi && prev.length === 1) {
        newSelected = [value];
      }

      if (prev.includes(value)) {
        newSelected = prev.filter(item => item !== value);
      }

      onChange(id, newSelected);
      return newSelected;
    });
  }, [id, multi, onChange]);

  const selectedValues = useMemo(
    () => values.filter(value => selected.includes(value.id)),
    [selected, values]
  );

  const renderLabel = useCallback(() => (
    <Toggle
      label={label}
      selected={<Selected values={selectedValues} />}
    />
  ), [label, selectedValues]);

  const handleLabel = useMemo(() => {
    if (selectedValues.length === 0) {
      return i18n.text('filter.filter_by', { label });
    }

    return i18n.text('filter.filter_by_with_selected', {
      label,
      selected: formatSelectedLabels(selectedValues.map(value => value.label)),
    });
  }, [label, selectedValues]);

  return (
    <SurroundPortals
      portalName={PORTAL_FILTER_SELECTOR}
      portalProps={{
        filter: {
          id,
          label,
          values,
          isMultiSelect: multi,
        },
        selectedValueIds: selected,
        onChange: handleToggle,
      }}
    >
      <FilterItem>
        <Accordion
          renderLabel={renderLabel}
          testId={id}
          handleLabel={handleLabel}
          className={classes.accordion}
          chevronClassName={classes.chevron}
        >
          <div className={classes.content}>
            {values.map(value => (
              <ValueCheckbox
                key={value.id}
                id={value.id}
                label={value.label}
                hits={value.hits}
                isActive={selected.includes(value.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </Accordion>
      </FilterItem>
    </SurroundPortals>
  );
};

export default memo(Selector);
