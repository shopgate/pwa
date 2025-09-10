import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { useRichTextWidget } from './hooks';

const useStyles = makeStyles()(() => ({
  root: {},
}));

/**
 * @returns {JSX.Element}
 */
const RichText = () => {
  const { cx, classes } = useStyles();
  const { richText } = useRichTextWidget();

  if (!richText) return null;

  return (
    <div className={cx(classes.root)}>
      <HtmlSanitizer>
        {richText}
      </HtmlSanitizer>
    </div>
  );
};
export default RichText;
