import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useHtmlWidget } from './hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    ' h1, h2, h3, h4, h5, h6, p, ul, ol': {
      margin: '1rem 0',
    },
    ' h1, h2, h3, h4, h5, h6': {
      fontWeight: theme.typography.fontWeightBold,
    },
    ' h1': {
      fontSize: '1.5rem',
    },
    ' h2': {
      fontSize: '1.25rem',
    },
    ' h3': {
      fontSize: '1.1rem',
    },
    ' h4, h5, h6': {
      fontSize: '1rem',
    },
    ' ol, ul': {
      paddingLeft: '1rem',
    },
    ' ol > li': {
      listStyle: 'decimal',
    },
    ' ul > li': {
      listStyle: 'disc',
    },
    ' img': {
      display: 'initial',
    },
    ' img[style*="float: left"], img[style*="float:left"], img.pull-left': {
      marginRight: '1rem',
    },
    ' img[style*="float: right"], img[style*="float:right"], img.pull-right': {
      marginLeft: '1rem',
    },
    ' code, pre': {
      whiteSpace: 'pre-wrap',
    },
    ' blockquote, q': {
      paddingLeft: '1rem',
      margin: '2rem 0',
      borderLeft: `.25rem solid ${theme.components.border.dark}`,
      fontStyle: 'italic',
    },
    ' > :first-child/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */': {
      marginTop: 0,
    },
    // Clearfix for floated widget content
    ':after': {
      clear: 'both',
      content: '"."',
      display: 'block',
      visibility: 'hidden',
      height: 0,
    },
    a: {
      color: theme.palette.primary.main,
    },
  },
}));

/**
 * The HtmlWidget component is used to display html code.
 * @returns {JSX.Element}
 */
const HtmlWidget = () => {
  const { classes } = useStyles();
  const { html } = useHtmlWidget();

  return (
    <HtmlSanitizer settings={{ html }} processStyles className={classes.root}>
      {html}
    </HtmlSanitizer>
  );
};

export default HtmlWidget;
