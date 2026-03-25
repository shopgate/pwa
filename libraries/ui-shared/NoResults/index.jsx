import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { svgToDataUrl } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import Icon from './components/Icon';

const { svgImages = {} } = themeConfig || {};
const { noResultsImage = '' } = svgImages || {};

const useStyles = makeStyles()({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'var(--page-background-color)',
  },
  icon: {
    width: 216,
    color: 'var(--color-primary)',
  },
  headline: {
    fontSize: '1.25rem',
    fontWeight: 500,
    marginTop: 30,
  },
  text: {
    marginTop: themeConfig.variables.gap.big,
    padding: `0 ${themeConfig.variables.gap.big}px`,
  },
});

/**
 * The NoResults component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const NoResults = (props) => {
  const { classes, cx } = useStyles();
  const imageSRC = useMemo(() => svgToDataUrl(noResultsImage), []);

  return (
    <div
      className={cx(classes.wrapper, props.className, ' ui-shared__no-results')}
      data-test-id="noResults"
    >
      <div className={cx(classes.icon, 'no-results__image')}>
        {noResultsImage ? <img src={imageSRC} alt="" /> : <Icon />}
      </div>
      <div role="alert" aria-atomic="true">
        <div className={classes.headline}>
          <I18n.Text string={props.headlineText} params={props} />
        </div>
        <div className={classes.text}>
          <I18n.Text string={props.bodyText} params={props} />
        </div>
      </div>
    </div>
  );
};

NoResults.defaultProps = {
  className: null,
};

NoResults.propTypes = {
  bodyText: PropTypes.string.isRequired,
  headlineText: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default NoResults;
