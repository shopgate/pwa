import React, { useState, useCallback, useMemo } from 'react';
import {
  SheetDrawer, SheetList, ArrowDropIcon, I18n, SurroundPortals,
} from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { useSort, PORTAL_FILTER_SORT_OPTIONS } from '@shopgate/engage/filter';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import Item from './components/Item';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexGrow: 2,
    minWidth: 0,
  },
  button: {
    color: 'inherit',
    outline: 0,
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    height: theme.components.filterBar.height,
    minWidth: 0,
  },
  selection: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  icon: {
    flexShrink: 0,
  },
}));

/**
 * The Sort component.
 * @returns {JSX}
 */
const Sort = () => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const { activeOption, options, updateRoute } = useSort();
  const [isOpen, setIsOpen] = useState(false);

  const activeLabel = useMemo(
    () => (options.find(option => option.value === activeOption) || options[0]).label,
    [activeOption, options]
  );

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSelect = useCallback((value) => {
    setIsOpen(false);
    updateRoute(value);
  }, [updateRoute]);

  return (
    <SurroundPortals portalName={PORTAL_FILTER_SORT_OPTIONS} portalProps={{ items: options }}>
      <div className={cx(classes.root, 'theme__filter-bar__sort')} data-test-id="sorting">
        <button
          className={classes.button}
          onClick={handleOpen}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          type="button"
        >
          <span className={classes.selection}>
            <I18n.Text string={activeLabel} />
          </span>
          <ArrowDropIcon className={classes.icon} size={theme.components.icon.medium} />
        </button>
      </div>
      <SheetDrawer
        title={i18n.text('filter.sort.default')}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <SheetList>
          {options.map(option => (
            <Item
              key={option.value}
              label={option.label}
              value={option.value}
              isSelected={option.value === activeOption}
              onClick={handleSelect}
            />
          ))}
        </SheetList>
      </SheetDrawer>
    </SurroundPortals>
  );
};

export default Sort;
