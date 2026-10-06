import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import { SearchTrigger } from 'Components/Search/SearchField';
import RootCategories from '../RootCategories';

const useStyles = makeStyles()(theme => ({
  search: {
    display: 'flex',
    padding: theme.spacing(0, 2),
    marginBottom: 4,
  },
}));

/**
 * The BrowseContent component.
 * @returns {JSX.Element}
 */
const BrowseContent = () => {
  const { classes, cx } = useStyles();

  return (
    <>
      <BackBar />
      <Headline text={i18n.text('titles.browse')} tag="h1" />
      <div className={cx(classes.search, 'theme__browse__search-field')}>
        <SearchTrigger />
      </div>
      <RootCategories />
    </>
  );
};

export default BrowseContent;
