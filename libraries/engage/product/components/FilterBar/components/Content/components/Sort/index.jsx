import React from 'react';
import { SelectBox, ArrowDropIcon, SurroundPortals } from '@shopgate/engage/components';
import { useSort, PORTAL_FILTER_SORT_OPTIONS } from '@shopgate/engage/filter';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Item from './components/Item';

const { shadows, variables } = themeConfig;

const useStyles = makeStyles()(theme => ({
  button: {
    color: 'inherit',
    outline: 0,
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    justifyContent: 'center',
    height: variables.filterbar.height,
    whiteSpace: 'nowrap',
  },
  selection: {
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: 1,
    paddingTop: 1,
    alignSelf: 'center',
  },
  icon: {
    fontSize: '1.5rem',
  },
  iconOpen: {
    transform: 'rotate(180deg)',
  },
  dropdown: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    top: '100%',
    left: 0,
    background: 'var(--color-background-accent)',
    boxShadow: shadows.filter.sort,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      top: 'inherit',
    },
  },
  selectItem: {
    padding: 0,
    outline: 0,
    overflow: 'hidden',
    textAlign: 'left',
    width: '100%',
    color: 'var(--color-text-high-emphasis)',
    ':first-of-type': {
      marginTop: theme.spacing(1),
    },
    ':last-child': {
      marginBottom: theme.spacing(1),
    },
  },
  selectItemSelected: {
    fontWeight: 500,
  },
  selectBox: {
    flexGrow: 2,
  },
}));

/**
 * The Sort component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Sort = () => {
  const { classes } = useStyles();
  const { activeOption, options, updateRoute } = useSort();

  return (
    <SurroundPortals portalName={PORTAL_FILTER_SORT_OPTIONS} portalProps={{ items: options }}>
      <SelectBox
        handleSelectionUpdate={updateRoute}
        items={options}
        initialValue={activeOption}
        icon={ArrowDropIcon}
        item={Item}
        className={`${classes.selectBox} theme__filter-bar__sort`}
        classNames={classes}
        testId="sorting"
      />
    </SurroundPortals>
  );
};

export default Sort;
