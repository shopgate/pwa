import { render, screen, within } from '@testing-library/react';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import { MODAL_VARIANT_SELECT } from './constants';
import BasicDialog from './components/BasicDialog';
import TextMessageDialog from './components/TextMessageDialog';
import PipelineErrorDialog from './components/PipelineErrorDialog';
import VariantSelectModal from './components/VariantSelectModal';
import Dialog from './index';

jest.mock('@shopgate/engage/a11y/hooks', () => ({
  useTrackModalState: jest.fn(),
}));
jest.mock('./components/BasicDialog', () => Object.assign(jest.fn(), {
  propTypes: { title: () => null },
}));
jest.mock('./components/TextMessageDialog', () => jest.fn());
jest.mock('./components/HtmlContentDialog', () => jest.fn());
jest.mock('./components/PipelineErrorDialog', () => jest.fn());
jest.mock('./components/VariantSelectModal', () => jest.fn());

jest.mock('@shopgate/engage/components');

describe('<Dialog />', () => {
  let portals;

  beforeAll(() => {
    portals = document.createElement('div');
    portals.id = 'portals';
    document.body.appendChild(portals);
  });

  afterAll(() => {
    portals.remove();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    BasicDialog.mockImplementation(({ title }) => <div>{title}</div>);
    TextMessageDialog.mockImplementation(() => 'TextMessageDialog');
    PipelineErrorDialog.mockImplementation(() => 'PipelineErrorDialog');
    VariantSelectModal.mockImplementation(() => 'VariantSelectModal');
  });

  it('should render without props', () => {
    render(<Dialog modal={{ message: 'msg' }} />);

    const modal = screen.getByRole('alertdialog');

    expect(modal).toHaveClass('ui-shared__dialog-modal');
    expect(modal.querySelector('.common__backdrop')).toBeInTheDocument();
    expect(within(modal).getByText('TextMessageDialog')).toBeInTheDocument();
    expect(TextMessageDialog).toHaveBeenCalledTimes(1);
    expect(TextMessageDialog.mock.lastCall[0]).toEqual(expect.objectContaining({
      actions: [],
      message: 'msg',
    }));
    expect(BasicDialog).not.toHaveBeenCalled();
  });

  it('should render BasicDialog when no message given', () => {
    render(<Dialog modal={{ message: null }} />);

    expect(screen.getByRole('alertdialog')).toHaveClass('ui-shared__dialog-modal');
    expect(BasicDialog).toHaveBeenCalledTimes(1);
    expect(BasicDialog.mock.lastCall[0]).toEqual(expect.objectContaining({
      actions: [],
      message: undefined,
    }));
    expect(TextMessageDialog).not.toHaveBeenCalled();
  });

  it('should render a special dialog', () => {
    const params = {
      errorCode: '',
      message: '',
      pipeline: '',
      request: {},
    };

    render(<Dialog
      modal={{
        type: MODAL_PIPELINE_ERROR,
        params,
      }}
    />);

    expect(within(screen.getByRole('alertdialog')).getByText('PipelineErrorDialog')).toBeInTheDocument();
    expect(BasicDialog).not.toHaveBeenCalled();
    expect(TextMessageDialog).not.toHaveBeenCalled();
    expect(PipelineErrorDialog).toHaveBeenCalledTimes(1);
    expect(PipelineErrorDialog.mock.lastCall[0]).toEqual(expect.objectContaining({
      actions: [],
      params,
    }));
  });

  it('should render variant select dialog', () => {
    const params = {
      productId: 'product_1',
    };

    render(<Dialog
      modal={{
        message: 'Test',
        type: MODAL_VARIANT_SELECT,
        params,
      }}
    />);

    expect(within(screen.getByRole('alertdialog')).getByText('VariantSelectModal')).toBeInTheDocument();
    expect(BasicDialog).not.toHaveBeenCalled();
    expect(TextMessageDialog).not.toHaveBeenCalled();
    expect(VariantSelectModal).toHaveBeenCalledTimes(1);
    expect(VariantSelectModal.mock.lastCall[0]).toEqual(expect.objectContaining({
      actions: [],
      message: 'Test',
      params,
    }));
  });

  it('should convert title into translatable element', () => {
    const title = 'translate.me';
    const titleParams = {
      foo: 'bar',
    };

    // eslint-disable-next-line extra-rules/no-single-line-objects
    render(<Dialog modal={{ title, titleParams }} />);

    expect(BasicDialog.mock.lastCall[0]).toEqual(expect.objectContaining({
      title: expect.objectContaining({
        props: expect.objectContaining({
          string: title,
          params: titleParams,
        }),
      }),
    }));
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
