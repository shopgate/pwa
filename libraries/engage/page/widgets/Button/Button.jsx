import React, { useCallback } from 'react';
import { Button } from '@shopgate/engage/components';
import { useWidget } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useNavigation } from '@shopgate/engage/core';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import PropTypes from 'prop-types';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    whiteSpace: 'nowrap',
  },
});

/**
 * The ButtonWidget is used to display a button.
 * @param {Object} props The component props.
 * @param {Function} [props.onClick] The onClick handler.
 * @returns {JSX.Element}
 */
const ButtonWidget = ({ onClick }) => {
  const { classes } = useStyles();

  const { config } = useWidget();
  const { text, link } = config;
  const { push } = useNavigation();

  const handleClick = useCallback((e) => {
    e.stopPropagation();

    if (!link || IS_PAGE_PREVIEW_ACTIVE) return onClick();

    return push({ pathname: link });
  }, [link, onClick, push]);

  if (!text) return null;

  return (
    <div className={classes.root}>
      <Button
        type="secondary"
        onClick={handleClick}
        wrapContent={false}
      >
        <span className={classes.text}>{text}</span>
      </Button>
    </div>
  );
};

ButtonWidget.propTypes = {
  onClick: PropTypes.func,
};

ButtonWidget.defaultProps = {
  onClick: () => {},
};

export default ButtonWidget;
