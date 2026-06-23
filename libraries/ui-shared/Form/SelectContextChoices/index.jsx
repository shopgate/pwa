import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { i18n } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import Chevron from '../../icons/ChevronIcon';
import InfoField from '../InfoField';
import ContextMenu from '../../ContextMenu';

const useStyles = makeStyles()({
  chevron: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%) rotateZ(-90deg)',
    fontSize: '1.3em !important',
    marginTop: -3,
  },
  toggle: {
    fontSize: '1rem',
    paddingRight: '2rem',
  },
  itemSelected: {
    backgroundColor: themeConfig.colors.shade8,
    fontWeight: 500,
  },
});

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const SelectContextChoices = ({
  options, onChange, value, placeholder, className, label, errorText, showErrorText,
}) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  const onMenuChange = useCallback(({ active }) => {
    setOpened(active);
  }, []);

  const onItemClick = useCallback((key) => {
    if (key === '') {
      onChange([]);
    } else if (value.includes(key)) {
      onChange(value.filter(v => v !== key));
    } else {
      onChange([...value, key]);
    }
  }, [onChange, value]);

  const hasValue = !!value && !!value.length;
  const values = hasValue ? Object.values(pick(options, value)) : [];

  return (
    <InfoField
      className={className}
      label={label}
      errorText={errorText}
      showErrorText={showErrorText}
      hasValue
      rightElement={<Chevron className={classes.chevron} />}
    >
      <div
        role="button"
        onClick={() => setOpened(true)}
        aria-hidden
        tabIndex="0"
        className={classes.toggle}
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
            className={hasValue && value.includes(key) ? classes.itemSelected : ''}
          >
            {options[key]}
          </ContextMenu.Item>
        ))}
      </ContextMenu>

    </InfoField>
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
