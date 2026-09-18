import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';

const useStyles = makeStyles()({
  root: {
    fontSize: 20,
    fontWeight: 500,
    flexGrow: 1,
    lineHeight: '56px',
    overflow: 'hidden',
    padding: '0 16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

/**
 * The AppBarTitle component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AppBarTitle = ({ onClick, title }) => {
  const { classes, cx } = useStyles();
  // Titles can contain HTML entities (e.g. product names). They are decoded to plain text, since
  // titles might originate from untrusted sources like URL parameters and must not render as HTML.
  const text = useMemo(() => htmlToText(title), [title]);

  if (!text) {
    return null;
  }

  return (
    <div
      className={cx(classes.root, 'theme__app-bar__title')}
      role="heading"
      aria-labelledby="titleLabel"
      aria-level="1"
      data-test-id={`title: ${text}`}
      tabIndex={-1}
    >
      <span role="presentation" onClick={onClick} id="titleLabel">
        {text}
      </span>
    </div>
  );
};

AppBarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

AppBarTitle.defaultProps = {
  onClick: null,
};

export default AppBarTitle;
