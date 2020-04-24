import React, { useState, useCallback } from 'react';
import { css } from 'glamor';
import { MagnifierIcon } from '@shopgate/engage/components';

const styles = {
  root: css({
    transition: '250ms border cubic-bezier(0.25, 0.1, 0.25, 1)',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 4,
    border: '1px solid #DADADA',
    height: 36,
    padding: '8px 15px',
  }).toString(),
  rootFocused: css({
    border: '1px solid var(--color-primary)',
  }).toString(),
  input: css({
    outline: 0,
    flex: 1,
  }).toString(),
  icon: css({
    display: 'flex',
    flexShrink: 0,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    outline: 0,
    color: '#5C5C5C',
    padding: 0,
  }).toString(),
};

/**
 * Search component
 * @returns {JSX}
 */
const Search = () => {
  const [focus, setFocus] = useState(false);
  const handleOnFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const handleOnBlur = useCallback(() => {
    setFocus(false);
  }, []);

  return (
    <div className={`${styles.root} ${focus && styles.rootFocused}`}>
      <input
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        className={styles.input}
        placeholder="Search"
      />
      <div className={styles.icon}>
        <MagnifierIcon />
      </div>
    </div>
  );
};

export default Search;
