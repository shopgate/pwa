import { render, screen, fireEvent } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import ReviewCard from './ReviewCard';

jest.mock('../ReviewVoting', () => ({
  __esModule: true,
  default: ({ review }: { review: { id: unknown } }) => (
    <div data-testid="review-voting" data-review-id={String(review.id)} />
  ),
}));

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

  it('should render the voting for the review', () => {
    render(<ReviewCard review={{
      id: 30,
      rate: 80,
    }}
    />);

    expect(screen.getByTestId('review-voting')).toHaveAttribute('data-review-id', '30');
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

  it('should render attachments only when the review has some', () => {
    const { container, rerender } = render(<ReviewCard review={{
      id: 20,
      rate: 80,
      media: [{
        type: 'image',
        url: 'https://example.com/a.jpg',
      }],
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-media')).toBeInTheDocument();

    rerender(<ReviewCard review={{
      id: 20,
      rate: 80,
    }}
    />);

    expect(container.querySelector('.engage__reviews__review-media')).not.toBeInTheDocument();
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

  it('should keep the merchant reply collapsed until the toggle is activated', () => {
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

    const toggle = screen.getByRole('button', { name: 'reviews.merchant_reply_show' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('.engage__reviews__review-card__reply-text'))
      .not.toBeInTheDocument();

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveTextContent('reviews.merchant_reply');
    const replyText = container.querySelector('.engage__reviews__review-card__reply-text');
    expect(replyText).toHaveTextContent('Thank you <b>very</b> much');
    expect(replyText?.querySelector('b')).not.toBeInTheDocument();
    expect(container.querySelector('.engage__reviews__review-card__reply-meta'))
      .toHaveTextContent('Customer Service · d');
    expect(dateSpy).toHaveBeenCalledWith(new Date('2026-08-01T10:00:00.000Z').getTime(), 'long');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('.engage__reviews__review-card__reply-text'))
      .not.toBeInTheDocument();
  });

  it('should render an opened merchant reply without author and date', () => {
    const { container } = render(<ReviewCard review={{
      id: 14,
      rate: 80,
      merchantReply: { reply: 'Thanks' },
    }}
    />);

    fireEvent.click(screen.getByRole('button', { name: 'reviews.merchant_reply_show' }));

    expect(container.querySelector('.engage__reviews__review-card__reply-text'))
      .toHaveTextContent('Thanks');
    expect(container.querySelector('.engage__reviews__review-card__reply-meta'))
      .not.toBeInTheDocument();
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

  it('should place the merchant reply before the voting', () => {
    const { container } = render(<ReviewCard review={{
      id: 16,
      rate: 80,
      merchantReply: { reply: 'Thanks' },
    }}
    />);

    const reply = container.querySelector('.engage__reviews__review-card__reply') as Element;
    const voting = screen.getByTestId('review-voting');

    expect(reply.compareDocumentPosition(voting)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
