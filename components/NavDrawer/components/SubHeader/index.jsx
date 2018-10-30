import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * The Sub Header component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SubHeader = ({ title }) => (
  <div className={style.subHeader}>
    <I18n.Text string={title} />
  </div>
);

SubHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SubHeader;
