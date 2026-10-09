import { fireEvent, render, screen } from '@testing-library/react';
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

  describe('distribution', () => {
    const summary = {
      average: 69,
      count: 35,
      distribution: {
        5: 10,
        4: 10,
        3: 5,
        2: 5,
        1: 5,
      },
    };

    /**
     * @param container The rendered container.
     * @returns Stars, bar width and row text of every distribution row.
     */
    const getRows = (container: HTMLElement) => Array.from(
      container.querySelectorAll<HTMLElement>('.engage__reviews__reviews-summary__distribution-row')
    ).map(row => ({
      stars: row.dataset.stars,
      width: row.querySelector<HTMLElement>(
        '.engage__reviews__reviews-summary__distribution-fill'
      )?.style.width,
      text: row.textContent,
    }));

    it('should not render rows without a distribution', () => {
      const { container } = render(<ReviewsSummary summary={{
        average: 69,
        count: 35,
      }}
      />);

      expect(container.querySelector('.engage__reviews__reviews-summary__distribution'))
        .not.toBeInTheDocument();
    });

    it('should render five rows from five to one star with the share of each count', () => {
      const { container } = render(<ReviewsSummary summary={summary} />);

      expect(getRows(container)).toEqual([
        {
          stars: '5',
          width: `${(10 / 35) * 100}%`,
          text: 'reviews.filter_rate_510',
        },
        {
          stars: '4',
          width: `${(10 / 35) * 100}%`,
          text: 'reviews.filter_rate_410',
        },
        {
          stars: '3',
          width: `${(5 / 35) * 100}%`,
          text: 'reviews.filter_rate_35',
        },
        {
          stars: '2',
          width: `${(5 / 35) * 100}%`,
          text: 'reviews.filter_rate_25',
        },
        {
          stars: '1',
          width: `${(5 / 35) * 100}%`,
          text: 'reviews.filter_rate_15',
        },
      ]);
    });

    it('should take the share from the sum of the five counts, not from the rating count', () => {
      const { container } = render(<ReviewsSummary summary={{
        average: 100,
        count: 40,
        distribution: {
          5: 3,
          4: 1,
          3: 0,
          2: 0,
          1: 0,
        },
      }}
      />);

      expect(getRows(container).map(row => row.width)).toEqual(['75%', '25%', '0%', '0%', '0%']);
    });

    it('should render empty bars when every count is zero', () => {
      const { container } = render(<ReviewsSummary summary={{
        average: 80,
        count: 4,
        distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      }}
      />);

      expect(getRows(container).map(row => row.width)).toEqual(['0%', '0%', '0%', '0%', '0%']);
    });
  });

  describe('rate selection', () => {
    const summary = {
      average: 69,
      count: 35,
      distribution: {
        5: 10,
        4: 9,
        3: 7,
        2: 5,
        1: 4,
      },
    };

    it('should not render buttons without a select handler', () => {
      render(<ReviewsSummary summary={summary} selectedRate={4} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render a named button per row and mark the selected one', () => {
      const textSpy = jest.spyOn(i18nHelpers, 'text');
      const { container } = render(
        <ReviewsSummary summary={summary} selectedRate={4} onRateSelect={jest.fn()} />
      );

      const buttons = screen.getAllByRole('button');

      expect(textSpy.mock.calls.filter(call => (
        call[0] === 'reviews.summary_count' && call.length === 2
      )).map(call => call[1])).toEqual([
        { count: 10 }, { count: 9 }, { count: 7 }, { count: 5 }, { count: 4 },
      ]);
      expect(Array.from(
        container.querySelectorAll<HTMLElement>(
          '.engage__reviews__reviews-summary__distribution-row'
        )
      ).map(row => row.dataset.stars)).toEqual(['5', '4', '3', '2', '1']);

      expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual([
        'reviews.filter_rate_5, reviews.summary_count',
        'reviews.filter_rate_4, reviews.summary_count',
        'reviews.filter_rate_3, reviews.summary_count',
        'reviews.filter_rate_2, reviews.summary_count',
        'reviews.filter_rate_1, reviews.summary_count',
      ]);
      expect(buttons.map(button => button.getAttribute('aria-pressed'))).toEqual([
        'false', 'true', 'false', 'false', 'false',
      ]);
    });

    it('should render buttons that open the list without a selected rate', () => {
      const textSpy = jest.spyOn(i18nHelpers, 'text');
      render(<ReviewsSummary summary={summary} onRateSelect={jest.fn()} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons).toHaveLength(5);
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label', 'reviews.distribution_open');
      });
      expect(textSpy).toHaveBeenCalledWith('reviews.distribution_open', {
        label: 'reviews.filter_rate_5, reviews.summary_count',
      });
    });

    it('should render rows without ratings as plain rows when the rows open the list', () => {
      const onRateSelect = jest.fn();
      const { container } = render(<ReviewsSummary
        summary={{
          ...summary,
          distribution: {
            ...summary.distribution,
            2: 0,
          },
        }}
        onRateSelect={onRateSelect}
      />);

      expect(screen.getAllByRole('button')).toHaveLength(4);
      expect(container.querySelector('[data-stars="2"] button')).not.toBeInTheDocument();
      expect(container.querySelector('[data-stars="2"]')).toHaveTextContent('reviews.filter_rate_20');
    });

    it('should keep rows without ratings as buttons when the rows are toggles', () => {
      render(<ReviewsSummary
        summary={{
          ...summary,
          distribution: {
            ...summary.distribution,
            2: 0,
          },
        }}
        selectedRate={null}
        onRateSelect={jest.fn()}
      />);

      expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    it('should mark no row without a star filter', () => {
      render(<ReviewsSummary summary={summary} selectedRate={null} onRateSelect={jest.fn()} />);

      expect(screen.getAllByRole('button').map(button => button.getAttribute('aria-pressed')))
        .toEqual(['false', 'false', 'false', 'false', 'false']);
    });

    it('should select the stars of a row', () => {
      const onRateSelect = jest.fn();
      render(<ReviewsSummary summary={summary} selectedRate={4} onRateSelect={onRateSelect} />);

      fireEvent.click(screen.getAllByRole('button')[4]);

      expect(onRateSelect).toHaveBeenCalledWith(1);
    });

    it('should clear the selection with the selected row', () => {
      const onRateSelect = jest.fn();
      render(<ReviewsSummary summary={summary} selectedRate={4} onRateSelect={onRateSelect} />);

      fireEvent.click(screen.getAllByRole('button')[1]);

      expect(onRateSelect).toHaveBeenCalledWith(undefined);
    });
  });

  describe('placeholder', () => {
    it('should show a placeholder while a summary is expected and none is there', () => {
      const { container } = render(<ReviewsSummary summary={null} isLoading />);

      expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
        .toBeInTheDocument();
      expect(container.querySelector('.engage__reviews__reviews-summary')).not.toBeInTheDocument();
    });

    it('should show the summary instead of the placeholder once it is there', () => {
      const { container } = render(<ReviewsSummary
        summary={{
          average: 78,
          count: 12,
        }}
        isLoading
      />);

      expect(container.querySelector('.engage__reviews__reviews-summary__placeholder'))
        .not.toBeInTheDocument();
      expect(container.querySelector('.engage__reviews__reviews-summary')).toBeInTheDocument();
    });

    it('should not show the placeholder again after the first response', () => {
      const { container, rerender } = render(<ReviewsSummary summary={null} isLoading />);

      rerender(<ReviewsSummary summary={null} />);
      rerender(<ReviewsSummary summary={null} isLoading />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render nothing without a summary when none is expected', () => {
      const { container } = render(<ReviewsSummary summary={null} />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
