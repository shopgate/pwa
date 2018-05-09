import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import PlaceholderLabel from '../PlaceholderLabel';

const widths = [95, 100, 92, 88, 96, 93, 96, 48];

/**
 * The paragraph placeholder component.
 * Creates a simple paragraph out of PlaceholderLabels.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PlaceholderParagraph = ({
  className, children, lines, ready,
}) => {
  if (ready) {
    return children;
  }

  return (
    <div>
      {range(lines).map((num) => {
        const width = (num % 2 === 0) ?
          `${widths[((num / 2) + widths.length) % widths.length]}%` :
          null;

        return (
          <PlaceholderLabel
            key={num}
            style={width ? { width } : null}
            className={className}
          />
        );
      })}
    </div>
  );
};

PlaceholderParagraph.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  lines: PropTypes.number,
  ready: PropTypes.bool,
};

PlaceholderParagraph.defaultProps = {
  className: '',
  lines: 3,
  ready: false,
};

export default PlaceholderParagraph;
