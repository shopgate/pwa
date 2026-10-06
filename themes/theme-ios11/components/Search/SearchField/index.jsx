import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { getScannerRoute } from '@shopgate/pwa-common-commerce/scanner/helpers';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { useNavigation } from '@shopgate/engage/core/hooks';
import {
  MagnifierIcon, CrossIcon, BarcodeScannerIcon, SurroundPortals,
} from '@shopgate/engage/components';
import { SCANNER_ICON } from '@shopgate/engage/scanner/constants';
import { OPEN_SEARCH } from '@shopgate/engage/navigation';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    minWidth: 0,
    minHeight: 36,
    borderRadius: theme.shape.borderRadius,
    background: theme.components.input.background,
    color: theme.components.input.text,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    padding: theme.spacing(0, 0.75, 0, 1.25),
    fontSize: theme.components.icon.small,
    opacity: 0.6,
  },
  text: {
    flexGrow: 1,
    minWidth: 0,
    padding: theme.spacing(1.125, 0),
    border: 0,
    outline: 'none',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitAppearance: 'none',
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
  },
  placeholder: {
    opacity: 0.6,
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    alignSelf: 'stretch',
    minWidth: 36,
    padding: theme.spacing(0, 1),
    border: 0,
    background: 'transparent',
    color: 'inherit',
    fontSize: theme.components.icon.medium,
    outline: 0,
  },
  clearIcon: {
    fontSize: theme.components.icon.small,
  },
}));

/**
 * The input of the search overlay.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const SearchField = ({
  value, onChange, onSubmit, onClear, onCancel, inputRef,
}) => {
  const { classes, cx } = useStyles();

  /**
   * @param {Event} event The submit event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(value);
  };

  /**
   * @param {KeyboardEvent} event The key event.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <form
      className={cx(classes.field, 'theme__search-field')}
      onSubmit={handleSubmit}
      action="."
      role="search"
    >
      <span className={classes.icon} aria-hidden>
        <MagnifierIcon />
      </span>
      <input
        ref={inputRef}
        className={cx(classes.text, 'common__simple-input')}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={i18n.text('search.label')}
        aria-label={i18n.text('search.label')}
        onChange={event => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        data-test-id="searchInput"
      />
      {!!value && (
        <button
          type="button"
          className={cx(classes.iconButton, classes.clearIcon)}
          onClick={onClear}
          aria-label={i18n.text('search.clear')}
          data-test-id="search-field-clear"
        >
          <CrossIcon />
        </button>
      )}
    </form>
  );
};

SearchField.propTypes = {
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const { hasNoScanner, scanner: { showSearchFieldIcon } = {} } = appConfig;

/**
 * Looks like the search field and opens the search overlay.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const SearchTrigger = ({ query, className }) => {
  const { classes, cx } = useStyles();
  const { push } = useNavigation();
  const scannerSupported = useSelector(hasScannerSupport);
  const showScanner = !hasNoScanner && showSearchFieldIcon && scannerSupported && !query;
  const fieldRef = useRef(null);

  const emitOpen = useCallback((value) => {
    UIEvents.emit(OPEN_SEARCH, {
      query: value,
      origin: fieldRef.current,
    });
  }, []);

  const open = useCallback(() => emitOpen(query), [emitOpen, query]);
  const clear = useCallback(() => emitOpen(''), [emitOpen]);

  const openScanner = useCallback(() => {
    push({
      pathname: getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE),
      title: 'navigation.scanner',
    });
  }, [push]);

  return (
    <div
      ref={fieldRef}
      className={cx(classes.field, className, 'theme__search-trigger')}
      data-test-id="SearchField"
    >
      <span className={classes.icon} aria-hidden>
        <MagnifierIcon />
      </span>
      <button
        type="button"
        className={cx(classes.text, !query && classes.placeholder)}
        onClick={open}
        aria-label={query || i18n.text('search.label')}
      >
        {query || i18n.text('search.label')}
      </button>
      {!!query && (
        <button
          type="button"
          className={cx(classes.iconButton, classes.clearIcon)}
          onClick={clear}
          aria-label={i18n.text('search.clear')}
          data-test-id="search-field-clear"
        >
          <CrossIcon />
        </button>
      )}
      {showScanner && (
        <SurroundPortals portalName={SCANNER_ICON}>
          <button
            type="button"
            className={classes.iconButton}
            onClick={openScanner}
            aria-label={i18n.text('titles.scanner')}
            data-test-id="search-field-scanner"
          >
            <BarcodeScannerIcon />
          </button>
        </SurroundPortals>
      )}
    </div>
  );
};

SearchTrigger.propTypes = {
  className: PropTypes.string,
  query: PropTypes.string,
};

SearchTrigger.defaultProps = {
  className: '',
  query: '',
};

export { SearchTrigger };
export default SearchField;
