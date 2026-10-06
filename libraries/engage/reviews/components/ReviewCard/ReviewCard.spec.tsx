import { render, screen } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import ReviewCard from './ReviewCard';

type I18nSpyTarget = Record<'text' | 'number' | 'date', (...args: unknown[]) => unknown>;

const i18nHelpers = i18n as unknown as I18nSpyTarget;

describe('<ReviewCard />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should render stars, title, text, author and date', () => {
    const dateSpy = jest.spyOn(i18nHelpers, 'date');

    const { container } = render(<ReviewCard review={{
      id: 1,
      rate: 80,
      title: 'Great tea',
      review: 'First line\nSecond line',
      author: 'Max M.',
      date: '2026-07-28T10:00:00.000Z',
    }}
    />);

    expect(container.querySelector('[data-test-id="ratedStars: 4"]')).toBeInTheDocument();
    expect(screen.getByText('Great tea')).toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__text'))
      .toHaveTextContent('First line Second line');
    expect(container.querySelector('.engage__reviews__review-card__meta'))
      .toHaveTextContent('Max M. · d');
    expect(dateSpy).toHaveBeenCalledWith(new Date('2026-07-28T10:00:00.000Z').getTime(), 'long');
  });

  it('should omit title and text when they are missing', () => {
    const { container } = render(<ReviewCard review={{
      id: 2,
      rate: 40,
      author: 'Anna',
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__title')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__text')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__meta')).toHaveTextContent('Anna');
  });

  it('should render only the date when the author is missing', () => {
    const { container } = render(<ReviewCard review={{
      id: 3,
      rate: 60,
      date: '2026-07-28T10:00:00.000Z',
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__meta')).toHaveTextContent(/^d$/);
  });

  it('should not render an invalid date', () => {
    const dateSpy = jest.spyOn(i18nHelpers, 'date');

    const { container } = render(<ReviewCard review={{
      id: 4,
      rate: 60,
      author: 'Anna',
      date: 'not a date',
    }}
    />);

    expect(dateSpy).not.toHaveBeenCalled();
    expect(container.querySelector('.engage__reviews__review-card__meta')).toHaveTextContent(/^Anna$/);
  });

  it('should ignore fields that only contain whitespace', () => {
    const { container } = render(<ReviewCard review={{
      id: 6,
      rate: 80,
      title: '  ',
      review: '\n',
      author: ' ',
      date: '2026-07-28T10:00:00.000Z',
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__title')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__text')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__meta')).toHaveTextContent(/^d$/);
  });

  it('should omit the meta line without author and date', () => {
    const { container } = render(<ReviewCard review={{
      id: 5,
      rate: 100,
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__meta')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card')).toBeInTheDocument();
  });

  it('should render the verified badge only for verified reviews', () => {
    const { container, rerender } = render(<ReviewCard review={{
      id: 10,
      rate: 80,
      isVerified: true,
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__verified'))
      .toHaveTextContent('reviews.verified');

    rerender(<ReviewCard review={{
      id: 10,
      rate: 80,
      isVerified: false,
    }}
    />);
    expect(container.querySelector('.engage__reviews__review-card__verified'))
      .not.toBeInTheDocument();

    rerender(<ReviewCard review={{
      id: 10,
      rate: 80,
    }}
    />);
    expect(container.querySelector('.engage__reviews__review-card__verified'))
      .not.toBeInTheDocument();
  });

  it('should render custom fields as label and value pairs', () => {
    const { container } = render(<ReviewCard review={{
      id: 11,
      rate: 80,
      customFields: [
        {
          label: 'Quality',
          value: 'Good',
        },
        {
          label: 'Fit',
          value: '  ',
        },
        {
          label: 'Quality',
          value: 'Durable',
        },
      ],
    }}
    />);

    const fields = container.querySelector('.engage__reviews__review-card__custom-fields');
    expect(fields?.querySelectorAll('dt')).toHaveLength(2);
    expect(fields).toHaveTextContent('QualityGoodQualityDurable');
  });

  it('should not render a custom fields section without usable fields', () => {
    const { container } = render(<ReviewCard review={{
      id: 12,
      rate: 80,
      customFields: [],
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__custom-fields'))
      .not.toBeInTheDocument();
  });

  it('should render the merchant reply with author and date as plain text', () => {
    const textSpy = jest.spyOn(i18nHelpers, 'text');
    const dateSpy = jest.spyOn(i18nHelpers, 'date');

    const { container } = render(<ReviewCard review={{
      id: 13,
      rate: 80,
      merchantReply: {
        author: 'Customer Service',
        date: '2026-08-01T10:00:00.000Z',
        reply: 'Thank you <b>very</b> much',
      },
    }}
    />);

    const reply = container.querySelector('.engage__reviews__review-card__reply');
    expect(reply).toBeInTheDocument();
    expect(textSpy).toHaveBeenCalledWith(
      'reviews.merchant_reply',
      { author: 'Customer Service' },
      expect.anything()
    );
    expect(dateSpy).toHaveBeenCalledWith(new Date('2026-08-01T10:00:00.000Z').getTime(), 'long');
    expect(container.querySelector('.engage__reviews__review-card__reply-text'))
      .toHaveTextContent('Thank you <b>very</b> much');
    expect(reply?.querySelector('b')).not.toBeInTheDocument();
  });

  it('should render a merchant reply without author and date', () => {
    const dateSpy = jest.spyOn(i18nHelpers, 'date');

    const { container } = render(<ReviewCard review={{
      id: 14,
      rate: 80,
      merchantReply: { reply: 'Thanks' },
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__reply'))
      .toHaveTextContent('reviews.merchant_reply_default');
    expect(dateSpy).not.toHaveBeenCalled();
  });

  it('should not render a merchant reply without reply text', () => {
    const { container } = render(<ReviewCard review={{
      id: 15,
      rate: 80,
      merchantReply: {
        author: 'Customer Service',
        reply: '  ',
      },
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-card__reply')).not.toBeInTheDocument();
  });
});
