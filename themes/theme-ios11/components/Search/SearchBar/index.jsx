import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useOverlayScroll } from '../../AppBar/hooks';
import { SearchTrigger } from '../SearchField';
import { PERSISTENT_SEARCH_BAR_INPUT_WRAPPER } from '../constants';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr',
    transition: 'grid-template-rows 200ms ease-in-out, opacity 200ms ease-in-out',
  },
  collapsed: {
    gridTemplateRows: '0fr',
    opacity: 0,
  },
  inner: {
    minHeight: 0,
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 1),
  },
}));

/**
 * The search field below the header.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const SearchBar = ({ query, hideOnScroll }) => {
  const { classes, cx } = useStyles();
  const { scrollingDown: collapsed } = useOverlayScroll(hideOnScroll);

  return (
    <div className={cx(classes.root, hideOnScroll && collapsed && classes.collapsed, 'theme__search-bar')}>
      <div className={classes.inner}>
        <div className={classes.row}>
          <SurroundPortals portalName={PERSISTENT_SEARCH_BAR_INPUT_WRAPPER}>
            <SearchTrigger query={query} />
          </SurroundPortals>
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  hideOnScroll: PropTypes.bool,
  query: PropTypes.string,
};

SearchBar.defaultProps = {
  hideOnScroll: false,
  query: '',
};

export default SearchBar;
