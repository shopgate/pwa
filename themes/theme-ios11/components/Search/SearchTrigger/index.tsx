import { useCallback, useRef } from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import {
  MagnifierIcon, CrossIcon, BarcodeScannerIcon, SurroundPortals,
} from '@shopgate/engage/components';
import { SCANNER_ICON } from '@shopgate/engage/scanner/constants';
import { NavigationAction, OPEN_SEARCH } from '@shopgate/engage/navigation';
import type { NavigationActionSettings } from '@shopgate/engage/navigation';
import { useFieldStyles } from '../styles';

const { scanner: { showSearchFieldIcon = false } = {} } = (appConfig || {}) as {
  scanner?: { showSearchFieldIcon?: boolean };
};

const SCANNER_ACTION: NavigationActionSettings = {
  action: 'scanner',
  icon: '',
  link: '',
};

interface Props {
  /** The search phrase of the page, shown inside the field. */
  query?: string;
  className?: string;
}

/**
 * Looks like the search field and opens the search overlay.
 * @param props The component props.
 * @param props.query The search phrase of the page.
 * @param props.className A class for the field.
 * @returns The field.
 */
const SearchTrigger = ({ query = '', className }: Props) => {
  const { classes, cx } = useFieldStyles();
  const fieldRef = useRef<HTMLDivElement>(null);
  const label = i18n.text('search.label');

  const emitOpen = useCallback((value: string) => {
    UIEvents.emit(OPEN_SEARCH, {
      query: value,
      origin: fieldRef.current,
    });
  }, []);

  const open = useCallback(() => emitOpen(query), [emitOpen, query]);
  const openEmpty = useCallback(() => emitOpen(''), [emitOpen]);

  return (
    <div
      ref={fieldRef}
      className={cx(classes.field, className, 'theme__search-trigger')}
      data-has-query={query ? true : undefined}
      data-test-id="SearchField"
    >
      <span className={cx(classes.icon, 'theme__search-trigger__icon')} aria-hidden>
        <MagnifierIcon />
      </span>
      <button
        type="button"
        className={cx(classes.text, !query && classes.placeholder, 'theme__search-trigger__text')}
        onClick={open}
        aria-label={query ? `${label}: ${query}` : label}
        aria-haspopup="dialog"
      >
        {query || label}
      </button>
      {!!query && (
        <button
          type="button"
          className={cx(classes.iconButton, classes.clearIcon, 'theme__search-trigger__clear')}
          onClick={openEmpty}
          aria-label={i18n.text('search.new_search')}
          aria-haspopup="dialog"
          data-test-id="search-field-clear"
        >
          <CrossIcon />
        </button>
      )}
      {showSearchFieldIcon && !query && (
        <NavigationAction settings={SCANNER_ACTION}>
          {scanner => (
            <SurroundPortals portalName={SCANNER_ICON}>
              <button
                type="button"
                className={cx(classes.iconButton, 'theme__search-trigger__scanner')}
                onClick={scanner.onClick}
                aria-label={i18n.text(scanner.label)}
                data-test-id="search-field-scanner"
              >
                <BarcodeScannerIcon />
              </button>
            </SurroundPortals>
          )}
        </NavigationAction>
      )}
    </div>
  );
};

export default SearchTrigger;
