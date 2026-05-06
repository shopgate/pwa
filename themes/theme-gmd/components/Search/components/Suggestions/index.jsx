import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardConsumer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import List from './components/List';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    bottom: 'var(--safe-area-inset-bottom)',
    left: 0,
    overflow: 'auto',
    position: 'absolute',
    right: 0,
    top: `calc(${variables.navigator.height}px + var(--safe-area-inset-top))`,
  },
});

/**
 * The Suggestions component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Suggestions = ({ onClick, searchPhrase }) => {
  const { classes } = useStyles();
  return (
    <KeyboardConsumer>
      {({ overlap }) => (
        <section className={classes.root} style={{ paddingBottom: overlap }}>
          <List onClick={onClick} searchPhrase={searchPhrase} />
        </section>
      )}
    </KeyboardConsumer>
  );
};

Suggestions.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default Suggestions;
