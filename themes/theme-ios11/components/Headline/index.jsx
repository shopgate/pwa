import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    margin: '12px 16px',
  },
});

const variantMap = {
  h1: 'h1',
  h2: 'h2',
  // theme h3=20px but this component needs 22px — use h2 variant with h3 element
  h3: 'h2',
  h4: 'h4',
};
const centeredTags = ['h3', 'h4'];

/**
 * The Headline component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Headline = ({
  tag, style, text,
}) => {
  const { classes, cx } = useStyles();

  if (!text.length) {
    return null;
  }

  return (
    <Typography
      variant={variantMap[tag] || 'h2'}
      component={tag}
      align={centeredTags.includes(tag) ? 'center' : 'inherit'}
      className={cx(classes.root, 'headline', 'theme__headline')}
      style={style}
      data-test-id="Headline"
    >
      <I18n.Text string={text} />
    </Typography>
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
