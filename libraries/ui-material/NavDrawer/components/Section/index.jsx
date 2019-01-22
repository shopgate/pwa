import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Title from '../Title';
import Item from '../Item';
import Divider from '../Divider';

/**
 * The NavDrawerSectionComponent.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerSection = ({
  children, title, dividerTop, dividerBottom,
}) => {
  if (!children) {
    return null;
  }
  return (
    <Fragment>
      {dividerTop && (<Divider />)}
      <Title text={title} />
      {children}
      {dividerBottom && (<Divider />)}
    </Fragment>
  );
};

NavDrawerSection.Item = Item;

NavDrawerSection.propTypes = {
  children: PropTypes.node,
  dividerBottom: PropTypes.bool,
  dividerTop: PropTypes.bool,
  title: PropTypes.string,
};

NavDrawerSection.defaultProps = {
  children: null,
  dividerBottom: false,
  dividerTop: true,
  title: '',
};

export default NavDrawerSection;
