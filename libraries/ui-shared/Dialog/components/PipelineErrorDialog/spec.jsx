import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import PipelineErrorDialog from './index';

jest.mock('@shopgate/engage/a11y/components');

describe('<PipelineErrorDialog />', () => {
  const defaultParams = {
    code: '123',
    message: 'Error message',
    pipeline: 'fakePipeline',
    request: {},
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with minimal props', () => {
    render(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'modal.title_error' })).toBeInTheDocument();
    expect(screen.getByText(defaultParams.message)).toBeInTheDocument();
    expect(screen.queryByText('Pipeline:')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show a custom message if a message is is provided', () => {
    const message = 'Custom message';
    render((
      <PipelineErrorDialog
        actions={[]}
        message={message}
        params={defaultParams}
      />
    ));

    expect(screen.getByRole('heading', { name: 'modal.title_error' })).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByText(defaultParams.message)).not.toBeInTheDocument();
  });

  it('should switch modes on tap', () => {
    render(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    const numTaps = 10;

    const devMarker = 'Pipeline:';

    for (let i = 0; i < numTaps; i += 1) {
      expect(screen.queryByText(devMarker)).not.toBeInTheDocument();
      fireEvent.click(screen.getByText(defaultParams.message));
    }

    expect(screen.getByText(devMarker)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pipeline Error' })).toBeInTheDocument();

    // Dev mode should be enabled until 10 more taps.
    for (let i = 0; i < numTaps - 1; i += 1) {
      expect(screen.getByText(devMarker)).toBeInTheDocument();
      fireEvent.click(screen.getByText(defaultParams.message));
    }

    fireEvent.click(screen.getByText(defaultParams.message));
    expect(screen.queryByText(devMarker)).not.toBeInTheDocument();
  });

  it('should open directly in developer detail mode when params.openWithDetails is set', () => {
    render((
      <PipelineErrorDialog
        actions={[]}
        params={{
          ...defaultParams,
          openWithDetails: true,
        }}
      />
    ));

    // Developer detail view is shown immediately, without any tapping.
    expect(screen.getByText('Pipeline:')).toBeInTheDocument();
    expect(screen.getByText('Code:')).toBeInTheDocument();
    expect(screen.getByText(/fakePipeline/)).toBeInTheDocument();
  });

  it('should not switch modes if tapped too slow', () => {
    jest.useFakeTimers();

    render(<PipelineErrorDialog actions={[]} params={defaultParams} />);

    const numTaps = 10;
    const numTapsUntilTimeout = Math.round(numTaps / 2);

    const devMarker = 'Pipeline:';

    expect(screen.queryByText(devMarker)).not.toBeInTheDocument();

    /**
     * Simulates multiple tap events.
     * @param {number} amount The number of tap events to simulate in a row.
     */
    const tapOnElement = (amount) => {
      if (amount > 0) {
        fireEvent.click(screen.getByText(defaultParams.message));
        tapOnElement(amount - 1);
      }
    };

    tapOnElement(numTapsUntilTimeout);

    act(() => {
      jest.runAllTimers();
    });

    tapOnElement(numTaps - numTapsUntilTimeout);

    expect(screen.queryByText(devMarker)).not.toBeInTheDocument();

    tapOnElement(numTapsUntilTimeout);

    expect(screen.getByText(devMarker)).toBeInTheDocument();
  });
});
