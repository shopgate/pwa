import React from 'react';
import PropTypes from 'prop-types';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    '& > :first-child': {
      marginTop: 0,
    },
    '& > :last-child': {
      marginBottom: 0,
    },
    '& p': {
      margin: '0px 0px 1rem 0px',
      ':empty': {
        minHeight: '1rem',
      },
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
 * @param {Object} props The component props.
 * @param {string} props.content The rich text content.
 * @returns {JSX.Element}
 */
const WidgetRichText = ({
  content,
  className,
}) => {
  const { cx, classes } = useStyles();

  if (!content) return null;

  return (
    <HtmlSanitizer
      processStyles
      settings={{ html: content }}
      className={cx(classes.root, className)}
    >
      {content}
    </HtmlSanitizer>
  );
};

WidgetRichText.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
};

WidgetRichText.defaultProps = {
  content: '',
  className: null,
};

export default WidgetRichText;
