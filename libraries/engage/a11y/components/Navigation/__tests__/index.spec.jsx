import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Navigation from '../index';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: jest.fn(key => key),
  },
}));

jest.mock('../../../../components', () => ({
  I18n: {
    Text: function Translate({ string }) {
      return string;
    },
  },
  Link: function Link({ children }) { return children; },
}));

const entries = [{
  title: 'Title One',
  link: '/some-link',
}, {
  title: 'Title Two',
  link: '/another-link',
}];

describe('<Navigation />', () => {
  it('should render with an aria label and entries', () => {
    const title = 'Navigation Title';
    render(<Navigation title={title} entries={entries} />);
    const nav = screen.getByRole('navigation', { name: title });

    expect(nav).toMatchSnapshot();
    expect(nav).toHaveAttribute('aria-label', title);
    expect(nav.querySelectorAll('ul > li')).toHaveLength(2);
  });

  it('should render empty when no entries are passed', () => {
    const { container } = render(<Navigation />);

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
