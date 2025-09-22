import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useRichTextWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  html: {
    '& > p:first-child': {
      marginTop: 0,
    },
    '& p': {
      margin: '0px 0px 1rem 0px',
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
    h1: {
      ...theme.typography.h1,
      margin: '0px 0px 1rem 0px',
    },
    h2: {
      ...theme.typography.h2,
      margin: '0px 0px 1rem 0px',
    },
    h3: {
      ...theme.typography.h3,
      margin: '0px 0px 1rem 0px',
    },
    h4: {
      ...theme.typography.h4,
      margin: '0px 0px 1rem 0px',
    },
    h5: {
      ...theme.typography.h5,
      margin: '0px 0px 1rem 0px',
    },
    h6: {
      ...theme.typography.h6,
      margin: '0px 0px 1rem 0px',
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
    <div className={cx(classes.root)}>
      <HtmlSanitizer
        processStyles
        settings={{ html: richText }}
        className={cx(classes.html)}
      >
        {richText}
      </HtmlSanitizer>
    </div>
  );
};
export default RichText;
