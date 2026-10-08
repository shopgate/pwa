import { render } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import ReviewsSummary from './ReviewsSummary';

type I18nSpyTarget = Record<'text' | 'number' | 'date', (...args: unknown[]) => unknown>;

const i18nHelpers = i18n as unknown as I18nSpyTarget;

describe('<ReviewsSummary />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the average, the stars and the rating count', () => {
    const numberSpy = jest.spyOn(i18nHelpers, 'number');
    jest.spyOn(i18nHelpers, 'text').mockImplementation((key, params) => (
      `${key}:${(params as { count?: number })?.count}`
    ));

    const { container } = render(<ReviewsSummary summary={{
      average: 78,
      count: 12,
    }}
    />);

    expect(container.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    expect(numberSpy).toHaveBeenCalledWith(3.9, 1);
    expect(container.querySelector('.ui-shared__rating-stars')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__rating-count'))
      .toHaveTextContent(/^reviews\.summary_count:12$/);
  });

  it('should hide only the count when it is not available', () => {
    const { container } = render(<ReviewsSummary summary={{
      average: 60,
      count: null,
    }}
    />);

    expect(container.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__reviews-summary__count')).not.toBeInTheDocument();
  });

  it('should hide the count when it is zero', () => {
    const { container } = render(<ReviewsSummary summary={{
      average: 60,
      count: 0,
    }}
    />);

    expect(container.querySelector('.engage__reviews__reviews-summary__count')).not.toBeInTheDocument();
  });

  it('should render nothing without a summary', () => {
    const { container } = render(<ReviewsSummary summary={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing without an average rating', () => {
    const { container } = render(<ReviewsSummary summary={{
      average: null,
      count: 3,
    }}
    />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing for an average rating of zero without ratings', () => {
    const { container } = render(<ReviewsSummary summary={{
      average: 0,
      count: 0,
    }}
    />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing for an average rating of zero without a count', () => {
    const { container } = render(<ReviewsSummary summary={{
      average: 0,
      count: null,
    }}
    />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render an average rating of zero when ratings exist', () => {
    const numberSpy = jest.spyOn(i18nHelpers, 'number');

    const { container } = render(<ReviewsSummary summary={{
      average: 0,
      count: 5,
    }}
    />);

    expect(container.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    expect(numberSpy).toHaveBeenCalledWith(0, 1);
    expect(container.querySelector('.engage__reviews__reviews-summary__count')).toBeInTheDocument();
  });
});
