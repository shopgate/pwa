/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import errorHandleScanner from '../action-creators/errorHandleScanner';
import handleNoResults from './handleNoResults';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => (
  jest.fn().mockResolvedValue(true)
));

const scope = SCANNER_SCOPE_DEFAULT;
const format = 'EAN_13';
const payload = '123456';

describe('handleNoResults', () => {
  const dispatch = jest.fn(action => action);
  const scannerStart = jest.spyOn(Scanner, 'start').mockImplementation(() => {});

  const modalContent = {
    dismiss: null,
    confirm: 'modal.ok',
    title: 'modal.title_error',
    message: 'test_message',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show a modal with a predefined display message', async () => {
    await handleNoResults({ scope, format, payload }, modalContent.message)(dispatch);
    expect(showModal).toHaveBeenCalledWith(modalContent);
    expect(scannerStart).toHaveBeenCalledTimes(1);
  });

  it('should inform listeners that an error occurred', async () => {
    await handleNoResults({ scope, format, payload }, modalContent.message)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(errorHandleScanner(scope, format, payload));
  });

  it('should start the Scanner again', async () => {
    await handleNoResults({ scope, format, payload }, modalContent.message)(dispatch);
    expect(scannerStart).toHaveBeenCalledTimes(1);
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
