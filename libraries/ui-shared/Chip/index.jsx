import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import CrossIcon from '../icons/CrossIcon';
import styles from './style';

/**
 * The chip component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Chip(props) {
  const {
    removable, children, id, onClick, onRemove, invert, removeLabel, editLabel,
  } = props;
  const ref = useRef(null);

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [onRemove, id]);

  useEffect(() => {
    ref.current.removeAttribute('style');
  });

  return (
    <div ref={ref} className={`ui-shared__chip ${styles.chip(removable, invert)}`} data-test-id={id}>
      {removable && (
        <Button
          className={styles.removeButton}
          onClick={handleRemove}
          testId="removeFilter"
          aria-label={removeLabel}
        >
          <ResponsiveContainer breakpoint="<=xs" appAlways>
            <CrossIcon
              size={16}
            />
          </ResponsiveContainer>
          <ResponsiveContainer breakpoint=">xs" webOnly>
            <CrossIcon
              size={18}
            />
          </ResponsiveContainer>

        </Button>
      )}
      <Button className={styles.name} onClick={onClick} aria-label={editLabel}>
        {children}
      </Button>
    </div>
  );
}

Chip.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  editLabel: PropTypes.string,
  invert: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  removable: PropTypes.bool,
  removeLabel: PropTypes.string,
};

Chip.defaultProps = {
  invert: false,
  onClick: () => { },
  onRemove: () => { },
  removable: true,
  removeLabel: null,
  editLabel: null,
};

export default Chip;
