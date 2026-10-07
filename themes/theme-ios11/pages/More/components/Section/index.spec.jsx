/* eslint-disable react/prop-types */
import { render, screen, within } from '@testing-library/react';
import Item from '../Item';
import Section from './index';

jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }) => string },
  Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
  Typography: ({ children, component: Component }) => <Component>{children}</Component>,
}));

const getList = container => container.querySelector('[data-test-id="more-section-list"]');

const getItems = list => within(list).getAllByRole('button').map(item => ({
  label: item.textContent,
  href: item.getAttribute('href'),
}));

const expectedItems = [{
  label: 'Item One',
  href: '/link/one',
}, {
  label: 'Item Two',
  href: '/link/two',
}];

describe('<Section />', () => {
  it('should render with a headline and items', () => {
    const title = 'Headline';
    const { container } = render((
      <Section title={title}>
        <Item href="/link/one" label="Item One" />
        <Item href="/link/two" label="Item Two" />
      </Section>));

    expect(screen.getByRole('heading', {
      level: 2,
      name: title,
    })).toBeInTheDocument();
    expect(getItems(getList(container))).toEqual(expectedItems);
  });

  it('should render without a headline but items', () => {
    const { container } = render((
      <Section>
        <Item href="/link/one" label="Item One" />
        <Item href="/link/two" label="Item Two" />
      </Section>));

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(getItems(getList(container))).toEqual(expectedItems);
  });

  it('should not render without items', () => {
    const title = 'Headline';
    const { container } = render(<Section title={title} />);

    expect(container).toBeEmptyDOMElement();
  });
});
/* eslint-enable react/prop-types */
