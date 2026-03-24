import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    margin: '12px 16px',
  },
  h1: {
    fontSize: 34,
  },
  h2: {
    fontSize: 22,
  },
  h3: {
    fontSize: 22,
    textAlign: 'center',
  },
  h4: {
    fontSize: 17,
    textAlign: 'center',
  },
});

/**
 * The Headline component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Headline = ({ tag: Tag, style, text }) => {
  const { classes, cx } = useStyles();

  if (!text.length) {
    return null;
  }

  return (
    <Tag
      className={cx(classes.root, classes[Tag], 'headline', 'theme__headline')}
      style={style}
      data-test-id="Headline"
    >
      <I18n.Text string={text} />
    </Tag>
  );
};

Headline.propTypes = {
  style: PropTypes.shape(),
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  text: PropTypes.string,
};

Headline.defaultProps = {
  style: null,
  tag: 'h2',
  text: '',
};

export default Headline;
