import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { WidgetRichText } from '@shopgate/engage/page/components';
import { useRichTextWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}));

/**
 * @returns {JSX.Element}
 */
const RichText = () => {
  const { richText } = useRichTextWidget();
  const { cx, classes } = useStyles();

  if (!richText) return null;

  return (
    <WidgetRichText
      content={richText}
      className={cx(classes.root)}
    />
  );
};
export default RichText;
