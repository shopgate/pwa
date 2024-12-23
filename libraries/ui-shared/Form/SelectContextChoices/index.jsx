import React, { useState, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { i18n } from '@shopgate/engage/core';
import Chevron from '../../icons/ChevronIcon';
import InfoField from '../InfoField';
import ContextMenu from '../../ContextMenu';
import styles from './style';

/**
 * @param {Object} props .
 * @returns {JSX}
 */
const SelectContextChoices = ({
  options, onChange, value, placeholder, className, label, errorText, showErrorText,
}) => {
  const [opened, setOpened] = useState(false);

  const onMenuChange = useCallback(({ active }) => {
    setOpened(active);
  }, []);

  const onItemClick = useCallback((key) => {
    if (key === '') {
      onChange([]);
    } else if (value.includes(key)) {
      // Eliminate value
      onChange(value.filter(v => v !== key));
    } else {
      onChange([...value, key]);
    }
  }, [onChange, value]);

  const hasValue = !!value && !!value.length;
  const values = hasValue ? Object.values(pick(options, value)) : [];

  return (
    <Fragment>
      <InfoField
        className={className}
        label={label}
        errorText={errorText}
        showErrorText={showErrorText}
        hasValue
        rightElement={<Chevron className={styles.chevron} />}
      >
        <div
          role="button"
          onClick={() => setOpened(true)}
          aria-hidden
          tabIndex="0"
          className={styles.toggle}
        >
          {!hasValue && (placeholder || i18n.text('common.please_choose'))}
          {hasValue && values.join(', ')}
        </div>

        <ContextMenu
          isOpened={opened}
          onStateChange={onMenuChange}
          showToggle={false}
          scroll
        >
          {Object.keys(options).map(key => (
            <ContextMenu.Item
              key={key}
              autoClose={false}
              onClick={() => onItemClick(key)}
              className={hasValue && value.includes(key) ? styles.itemSelected : ''}
            >
              {options[key]}
            </ContextMenu.Item>
          ))}
        </ContextMenu>

      </InfoField>
    </Fragment>
  );
};

SelectContextChoices.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.node,
  label: PropTypes.node,
  onChange: PropTypes.func,
  options: PropTypes.shape(),
  placeholder: PropTypes.node,
  showErrorText: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.string),
};

SelectContextChoices.defaultProps = {
  className: '',
  errorText: '',
  placeholder: '',
  label: '',
  onChange: () => {},
  options: {},
  value: [],
  showErrorText: true,
};

export default SelectContextChoices;
