import React from 'react';
import PropTypes from 'prop-types';
import { NavDrawer } from '@shopgate/engage/components';
import NavDrawerSectionWrapper from './components/Section';

/**
 * The HeadlineCompatibility is a wrapper for the NavDrawerTitle component. It's enables props
 * backwards compatibility for older versions of the component. Before "title" was used to set the
 * text for the component. Now it's "text".
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const HeadlineCompatibility = ({ text, title }) => {
  const titleText = text || title;
  return (<NavDrawer.Title text={titleText} />);
};

HeadlineCompatibility.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string,
};

HeadlineCompatibility.defaultProps = {
  title: '',
  text: '',
};

export default {
  Divider: NavDrawer.Divider,
  Headline: HeadlineCompatibility,
  Item: NavDrawer.Item,
  Section: NavDrawerSectionWrapper,
};
