import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import { i18n } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import Ripple from '../../../Ripple';
import CrossIcon from '../../../icons/CrossIcon';
import SearchBar from './components/SearchBar';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    position: 'relative',
    zIndex: 2,
  },
  closePlaceholder: {
    height: themeConfig.variables.navigator.height,
    padding: 0,
    lineHeight: 1,
  },
  closeButton: {
    lineHeight: 1,
    outline: 0,
    padding: 0,
    minWidth: themeConfig.variables.navigator.height,
    height: themeConfig.variables.navigator.height,
    position: 'relative',
    zIndex: 2,
    color: theme.palette.text.primary,
  },
  closeIcon: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 500,
    position: 'relative',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
  },
  headerShadow: {
    boxShadow: themeConfig.shadows.material,
  },
}));

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Header = ({
  title,
  allowClose,
  handleChange,
  onToggleClose,
  shadow,
  showSearch,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx({ [classes.headerShadow]: shadow })}>
      <Grid className={classes.wrapper} component="div" wrap={false}>
        {allowClose ? (
          <button
            className={classes.closeButton}
            onClick={onToggleClose}
            aria-label={i18n.text('common.close')}
            type="button"
          >
            <Ripple className={classes.closeIcon}>
              <CrossIcon size={24} />
            </Ripple>
          </button>
        ) : <div className={classes.closePlaceholder} />}
        <Grid.Item
          className={classes.title}
          component="div"
          grow={1}
          role="heading"
          {...(allowClose ? { tabIndex: 0 } : null)}
        >
          {title}
        </Grid.Item>
      </Grid>
      {showSearch && <SearchBar handleChange={handleChange} />}
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  allowClose: PropTypes.bool,
  handleChange: PropTypes.func,
  onToggleClose: PropTypes.func,
  shadow: PropTypes.bool,
  showSearch: PropTypes.bool,
};

Header.defaultProps = {
  onToggleClose: () => {},
  shadow: false,
  allowClose: true,
  handleChange: () => {},
  showSearch: false,
};

export default memo(Header);
