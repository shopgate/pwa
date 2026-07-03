import React from 'react';
import {
  render,
  screen,
} from '@testing-library/react';
import NavDrawerTitle from './index';

const mockI18nText = jest.fn(({ string }) => <span data-testid="i18n-text">{string}</span>);

jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children }) => children,
  I18n: {
    Text: props => mockI18nText(props),
  },
}));

describe('<NavDrawerTitle />', () => {
  beforeEach(() => {
    mockI18nText.mockClear();
  });

  it('should render when a text is passed within the props', () => {
    const title = 'Title';
    const { container } = render(<NavDrawerTitle text={title} />);

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByTestId('i18n-text')).toHaveTextContent(title);
    expect(mockI18nText).toHaveBeenCalledWith(expect.objectContaining({ string: title }));
  });

  it('should not render when no text is passed within the props', () => {
    const { container } = render(<NavDrawerTitle />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeNull();
    expect(mockI18nText).not.toHaveBeenCalled();
  });
});
