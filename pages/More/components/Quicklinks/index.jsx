import React from 'react';
import PropTypes from 'prop-types';
import Section from '../Section';
import connect from './connector';

/**
 * The Quicklinks component.
 * @param {Object} props The component props.
 * @param {Array} props.entries The quicklinks.
 * @returns {JSX}
 */
function Quicklinks({ entries }) {
  if (!entries || !entries.length) {
    return null;
  }

  return (
    <Section title="navigation.more_menu">
      {entries.map(entry => (
        <Section.Item href={entry.url} key={entry.url} label={entry.label} />
      ))}
    </Section>
  );
}

Quicklinks.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape()),
};

Quicklinks.defaultProps = {
  entries: null,
};

export default connect(Quicklinks);
