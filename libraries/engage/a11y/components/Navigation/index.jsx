import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { Link, I18n } from '@shopgate/engage/components';

const useStyles = makeStyles()({
  hiddenNavigation: {
    clip: 'rect(1px, 1px, 1px, 1px)',
    height: '1px',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
    zIndex: -1000,
  },
});

/**
 * @param {Object} props component props.
 * @param {string} props.title Navigation title.
 * @param {Array} props.entries Navigation entries.
 * @param {Object} context  The component context.
 * @returns {JSX}
 */
const Navigation = ({ title, entries }, context) => {
  const { classes } = useStyles();
  const { __ } = context.i18n();
  if (!entries || !entries.length) {
    return null;
  }

  return (
    <nav aria-label={title ? __(title) : null}>
      <ul className={classes.hiddenNavigation}>
        {entries.map(({ title: entryTitle, link }) => (
          <li key={link}>
            <Link href={link}>
              <I18n.Text string={entryTitle} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  })),
  title: PropTypes.string,
};

Navigation.defaultProps = {
  title: null,
  entries: [],
};

Navigation.contextTypes = {
  i18n: PropTypes.func,
};

export default Navigation;
