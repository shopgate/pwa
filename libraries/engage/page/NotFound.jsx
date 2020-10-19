import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { connect } from 'react-redux';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { historyPop } from '@shopgate/pwa-common/actions/router';

const mapDispatchToProps = {
  onClick: historyPop,
};

const { variables } = themeConfig;

const styles = {
  wrapper: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: variables.gap.big,
    paddingTop: variables.gap.xxbig,
  }).toString(),
  text: css({
    fontSize: '1.5rem',
  }).toString(),
  button: css({
    width: '100%',
    maxWidth: 250,
  }).toString(),
  buttonContainer: css({
    flexGrow: '0',
    padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
  }).toString(),
};

/**
 * @returns {JSX}
 */
const NotFound = ({ onClick }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div className={styles.wrapper}>
      <I18n.Text className={styles.text} string="page.not_found" />

      <div className={styles.buttonContainer}>
        <RippleButton onClick={handleClick} className={styles.button} type="secondary">
          <I18n.Text string="page.continue" />
        </RippleButton>
      </div>
    </div>
  );
};

NotFound.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(NotFound);
