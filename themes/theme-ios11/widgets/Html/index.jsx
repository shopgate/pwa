import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import HtmlSanitizer from '@shopgate/pwa-common/components/HtmlSanitizer';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import connect from './connector';

const { colors } = themeConfig;

const useStyles = makeStyles()(() => ({
  root: {
    '& h1, & h2, & h3, & h4, & h5, & h6, & p, & ul, & ol': {
      margin: '1rem 0',
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      fontWeight: 600,
    },
    '& h1': {
      fontSize: '1.5rem',
    },
    '& h2': {
      fontSize: '1.25rem',
    },
    '& h3': {
      fontSize: '1.1rem',
    },
    '& h4, & h5, & h6': {
      fontSize: '1rem',
    },
    '& ol, & ul': {
      paddingLeft: '1rem',
    },
    '& ol > li': {
      listStyle: 'decimal',
    },
    '& ul > li': {
      listStyle: 'disc',
    },
    '& img': {
      display: 'initial',
    },
    '& img[style*="float: left"], & img[style*="float:left"], & img.pull-left': {
      marginRight: '1rem',
    },
    '& img[style*="float: right"], & img[style*="float:right"], & img.pull-right': {
      marginLeft: '1rem',
    },
    '& code, & pre': {
      whiteSpace: 'pre-wrap',
    },
    '& blockquote, & q': {
      paddingLeft: '1rem',
      margin: '2rem 0',
      borderLeft: `.25rem solid ${colors.shade6}`,
      fontStyle: 'italic',
    },
    '& > :first-child': {
      marginTop: 0,
    },
    '&::after': {
      clear: 'both',
      content: '""',
      display: 'block',
      visibility: 'hidden',
      height: 0,
    },
  },
}));

/**
 * The custom HTML widget.
 * @param {Object} props The widget props.
 * @param {Object} props.settings The widget settings.
 * @param {Function} props.navigate The navigate action.
 * @returns {JSX.Element}
 */
const Html = ({ settings, navigate }) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const { html } = settings;

  return (
    <div
      style={{
        ...(settings.defaultPadding && { padding: theme.spacing(2) }),
      }}
    >
      <HtmlSanitizer
        className={classes.root}
        decode
        processStyles
        settings={{
          html,
          handleClick: navigate,
        }}
      >
        {html}
      </HtmlSanitizer>
    </div>
  );
};

Html.propTypes = {
  navigate: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    defaultPadding: PropTypes.bool,
    html: PropTypes.string,
  }).isRequired,
};

export { Html as UnwrappedHtml };
export default connect(Html);
