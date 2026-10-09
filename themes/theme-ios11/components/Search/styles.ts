/* eslint-disable tss-unused-classes/unused-classes */
import { makeStyles } from '@shopgate/engage/styles';
import { FLOATING_BUTTON_SIZE } from '../AppBar/constants';

export const useFieldStyles = makeStyles()(theme => ({
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    minWidth: 0,
    minHeight: FLOATING_BUTTON_SIZE,
    borderRadius: theme.shape.borderRadius,
    background: theme.components.input.background,
    color: theme.components.input.text,
    '&:has(> button:focus-visible:not([data-silent-focus]))': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 1,
    },
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
    opacity: 0.75,
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    alignSelf: 'stretch',
    minWidth: FLOATING_BUTTON_SIZE,
    padding: theme.spacing(0, 1),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    background: 'transparent',
    color: 'inherit',
    fontSize: theme.components.icon.medium,
    outline: 0,
    '&:focus-visible:not([data-silent-focus])': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },
  clearIcon: {
    fontSize: theme.components.icon.small,
  },
}));
/* eslint-enable tss-unused-classes/unused-classes */
