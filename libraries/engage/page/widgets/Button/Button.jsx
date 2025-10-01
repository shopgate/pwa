import React, { useCallback } from 'react';
import { Button } from '@shopgate/engage/components';
import { useWidget } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useNavigation } from '@shopgate/engage/core';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },

});

/**
 * The ButtonWidget is used to display a button.
 * @returns {JSX.Element}
 */
const ButtonWidget = () => {
  const { classes } = useStyles();

  const { config } = useWidget();
  const { text, link, style } = config;
  const { push } = useNavigation();

  const handleClick = useCallback((e) => {
    e.stopPropagation();

    if (!link) return;

    push({ pathname: link });
  }, [link, push]);

  if (!text) return null;

  return (
    <div className={classes.root}>
      <Button
        type={style || 'primary'}
        onClick={handleClick}
      >
        {text}
      </Button>
    </div>
  );
};

export default ButtonWidget;
