import React from 'react';
import PropTypes from 'prop-types';
import { Link, I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * @param {Object} props component props.
 * @param {string} props.title Navigation title.
 * @param {Array} props.entries Navigation entries.
 * @param {Object} context  The component context.
 * @returns {JSX}
 */
const Navigation = ({ title, entries }, context) => {
  const { __ } = context.i18n();
  if (!entries || !entries.length) {
    return null;
  }

  return (
    <nav aria-label={title ? __(title) : null}>
      <ul className={styles}>
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
