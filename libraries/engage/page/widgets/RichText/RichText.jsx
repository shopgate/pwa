import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useRichTextWidget } from './hooks';

const useStyles = makeStyles()(() => ({
  html: {
    '& p': {
      marginBottom: '17px',
    },
    'ul, ol': {
      paddingLeft: '40px',
    },
    'ul li': {
      listStyleType: 'disc',
    },
    'ol li': {
      listStyleType: 'decimal',
    },
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
    <HtmlSanitizer
      processStyles
      settings={{ html: richText }}
      className={cx(classes.html)}
    >
      {richText}
    </HtmlSanitizer>
  );
};
export default RichText;
