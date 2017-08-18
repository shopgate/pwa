import cxs from 'cxs';
import { variables } from 'Templates/styles';

const button = cxs({
  color: 'inherit',
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.navigator.height,
  position: 'relative',
  zIndex: 1,
});

const buttonContent = cxs({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

export default {
  button,
  buttonContent,
};
