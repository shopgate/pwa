import React from 'react';
import PropTypes from 'prop-types';
import { DefaultBar } from 'Components/AppBar/presets';
import { AppBarIOS } from '@shopgate/pwa-ui-ios';
import { ArrowIcon } from '@shopgate/engage/components';
import styles from './styles';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
const GalleryAppBar = ({ goBack }) => (
  <DefaultBar
    classes={{ outer: styles.outer }}
    backgroundColor="rgba(0, 0, 0, 0)"
    textColor="#fff"
    left={<AppBar.Icon key="left" icon={ArrowIcon} onClick={goBack} shadow />}
  />
);

GalleryAppBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(GalleryAppBar);
