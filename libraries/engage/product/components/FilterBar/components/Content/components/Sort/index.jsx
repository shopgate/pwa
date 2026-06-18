import React from 'react';
import {
  SelectBox, ArrowDropIcon, SurroundPortals,
} from '@shopgate/engage/components';
import { useSort, PORTAL_FILTER_SORT_OPTIONS } from '@shopgate/engage/filter';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Item from './components/Item';

const { variables } = themeConfig;

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
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1,
    paddingTop: 1,
    alignSelf: 'center',
  },
  icon: {
    fontSize: theme.components.icon.medium,
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
    background: theme.palette.background.emphasized,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0 2px 2px',
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
    color: theme.palette.text.primary,
    ':first-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginTop: theme.spacing(1),
    },
    ':last-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginBottom: theme.spacing(1),
    },
  },
  selectItemSelected: {
    fontWeight: theme.typography.fontWeightMedium,
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
  const { classes, cx } = useStyles();
  const { activeOption, options, updateRoute } = useSort();

  return (
    <SurroundPortals portalName={PORTAL_FILTER_SORT_OPTIONS} portalProps={{ items: options }}>
      <SelectBox
        handleSelectionUpdate={updateRoute}
        items={options}
        initialValue={activeOption}
        icon={ArrowDropIcon}
        item={Item}
        className={cx(classes.selectBox, 'theme__filter-bar__sort')}
        classNames={{
          button: classes.button,
          selection: classes.selection,
          icon: classes.icon,
          iconOpen: classes.iconOpen,
          dropdown: classes.dropdown,
          selectItem: classes.selectItem,
          selectItemSelected: classes.selectItemSelected,
        }}
        testId="sorting"
      />
    </SurroundPortals>
  );
};

export default Sort;
