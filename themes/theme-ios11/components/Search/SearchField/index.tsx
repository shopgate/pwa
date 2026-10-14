import type { FormEvent, RefObject } from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { MagnifierIcon, CrossIcon } from '@shopgate/engage/components';
import { useFieldStyles } from '../styles';

interface Props {
  value: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear: () => void;
}

/**
 * The input of the search overlay.
 * @param props The component props.
 * @param props.value The typed text.
 * @param props.onChange Receives the typed text.
 * @param props.onSubmit Runs the search.
 * @param props.onClear Empties the field.
 * @param props.inputRef The ref of the input.
 * @returns The search form.
 */
const SearchField = ({
  value, onChange, onSubmit, onClear, inputRef,
}: Props) => {
  const { classes, cx } = useFieldStyles();

  /**
   * @param event The submit event.
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form
      className={cx(classes.field, 'theme__search-field')}
      onSubmit={handleSubmit}
      action="."
      role="search"
    >
      <span className={cx(classes.icon, 'theme__search-field__icon')} aria-hidden>
        <MagnifierIcon />
      </span>
      <input
        ref={inputRef}
        className={cx(classes.text, 'theme__search-field__input', 'common__simple-input')}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={i18n.text('search.label')}
        aria-label={i18n.text('search.label')}
        onChange={event => onChange(event.target.value)}
        data-test-id="searchInput"
      />
      {!!value && (
        <button
          type="button"
          className={cx(classes.iconButton, classes.clearIcon, 'theme__search-field__clear')}
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

export default SearchField;
