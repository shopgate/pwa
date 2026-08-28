import { createPortal } from 'react-dom';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import ApplyButton from '../ApplyButton';
import ResetButton from '../ResetButton';

const useStyles = makeStyles()(theme => ({
  bar: {
    display: 'flex',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2),
    background: theme.palette.background.surface,
    boxShadow: '0 -4px 5px -2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 2,
    paddingBottom: `calc(${theme.spacing(1.5)}px + ${theme.layout.safeArea.bottom})`,
  },
  apply: {
    flex: 2,
  },
  reset: {
    flex: 1,
  },
}));

/**
 * The filter button bar renders the "View Results" and "Clear all" buttons in a sticky bar at the
 * bottom of the screen. It's rendered into the app footer via a portal.
 * @returns The rendered component, or `null` when the app footer is not available.
 */
const FilterButtonBar = () => {
  const { classes } = useStyles();
  const {
    hasChanged,
    resetPossible,
    applyFilters,
    resetAllFilters,
  } = useFilterPage();

  const domElement = typeof document !== 'undefined'
    ? document.getElementById('AppFooter')
    : null;

  if (!domElement) {
    return null;
  }

  return createPortal(
    <ResponsiveContainer appAlways breakpoint="<sm">
      <div className={classes.bar}>
        <ApplyButton
          className={classes.apply}
          disabled={!hasChanged}
          onClick={applyFilters}
        />
        <ResetButton
          className={classes.reset}
          disabled={!resetPossible}
          onClick={resetAllFilters}
        />
      </div>
    </ResponsiveContainer>,
    domElement
  );
};

export default FilterButtonBar;
