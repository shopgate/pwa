import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Headline from 'Components/Headline';
import Item from '../Item';
import connect from './connector';
import styles from '../../style';

/**
 * The Quicklinks component.
 * @param {Object} props The component props.
 * @param {Array} props.entries The quicklinks.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
function Quicklinks({ entries }, context) {
  if (!entries || !entries.length) {
    return null;
  }

  const { __ } = context.i18n();

  return (
    <Fragment>
      <Headline style={styles.headline} text={__('navigation.more_menu')} />
      <nav className={styles.list}>
        {entries.map(entry => (
          <Item href={entry.url} key={entry.url} label={entry.label} />
        ))}
      </nav>
    </Fragment>
  );
}

Quicklinks.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()),
};

Quicklinks.defaultProps = {
  entries: null,
};

Quicklinks.contextTypes = {
  i18n: PropTypes.func,
};

export default connect(Quicklinks);
