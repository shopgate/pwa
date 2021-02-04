import { useContext } from 'react';
import RadioGroupContext from './RadioGroup.context';

/**
 * Provides a radio group context
 * @returns {Object}
 */
export default function useRadioGroup() {
  return useContext(RadioGroupContext);
}
