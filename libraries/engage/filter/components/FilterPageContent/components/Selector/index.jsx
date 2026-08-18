import React, {
  useState, useEffect, useCallback, useRef, memo,
} from 'react';
import PropTypes from 'prop-types';
import { Accordion, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { useElementSize } from '@shopgate/engage/core/hooks';
import clamp from 'lodash/clamp';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import { FilterItem } from '@shopgate/engage/filter';
import { PORTAL_FILTER_SELECTOR } from '@shopgate/engage/filter/constants';
import ValueCheckbox from './components/ValueCheckbox';
import Toggle from './components/Toggle';
import Selected from './components/Selected';

const MAX_COLUMNS = 3;
const COLUMN_GAP = 2;

const useStyles = makeStyles()((theme, { columns }) => ({
  accordion: {
    overflow: 'hidden',
  },
  chevron: {
    alignSelf: 'flex-start',
  },
  content: {
    paddingBottom: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    justifyItems: 'start',
    columnGap: theme.spacing(COLUMN_GAP),
  },
}));

/**
 * The selector component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Selector = ({
  id,
  label,
  values,
  multi,
  onChange,
  selected: selectedFromProps,
}) => {
  const theme = useTheme();
  const contentRef = useRef(null);
  const { width } = useElementSize(contentRef, { includeWidth: true });
  const [valueWidth, setValueWidth] = useState(0);
  const gap = theme.spacing(COLUMN_GAP);

  const columns = valueWidth
    ? clamp(Math.floor((width + gap) / (valueWidth + gap)), 1, MAX_COLUMNS)
    : 1;

  const { classes } = useStyles({ columns });
  const [selected, setSelected] = useState(() => selectedFromProps || []);

  useEffect(() => {
    setSelected(selectedFromProps || []);
  }, [selectedFromProps]);

  useEffect(() => {
    const element = contentRef.current;
    const items = Array.from(element?.children ?? []);

    if (!items.length) {
      return;
    }

    element.style.gridTemplateColumns = '1fr';
    setValueWidth(Math.max(0, ...items.map(item => item.getBoundingClientRect().width)));
    element.style.gridTemplateColumns = '';
  }, [values]);

  const handleToggle = useCallback((value) => {
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

  const renderLabel = useCallback(props => (
    <Toggle
      {...props}
      label={label}
      selected={<Selected values={values} selected={selected} />}
    />
  ), [label, selected, values]);

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
          handleLabel={i18n.text('filter.filter_by', { label })}
          className={classes.accordion}
          chevronClassName={classes.chevron}
        >
          <div className={classes.content} ref={contentRef}>
            {values.map(value => (
              <ValueCheckbox
                key={value.id}
                id={value.id}
                label={value.label}
                isActive={(selected && selected.includes(value.id))}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </Accordion>
      </FilterItem>
    </SurroundPortals>
  );
};

Selector.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  multi: PropTypes.bool,
  onChange: PropTypes.func,
  selected: PropTypes.node,
};

Selector.defaultProps = {
  multi: false,
  onChange() {},
  selected: null,
};

export default memo(Selector);
