import React from 'react';
import { render } from '@testing-library/react';
import AppBarTitle from './index';

describe('<AppBarTitle />', () => {
  it('should not render without a title', () => {
    const { container } = render(<AppBarTitle title="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the title as text', () => {
    const { getByRole } = render(<AppBarTitle title="My Title" />);
    expect(getByRole('heading')).toHaveTextContent('My Title');
  });

  it('should decode HTML entities', () => {
    const { getByRole } = render(<AppBarTitle title={'Tom &amp; Jerry &quot;Deluxe&quot;'} />);
    expect(getByRole('heading')).toHaveTextContent('Tom & Jerry "Deluxe"');
  });

  it('should not render HTML markup', () => {
    const spy = jest.fn();
    window.xssSpy = spy;

    const payload = 'Search<img src=x onerror="window.xssSpy()">';
    const { container, getByRole } = render(<AppBarTitle title={payload} />);

    expect(container.querySelector('img')).toBeNull();
    expect(getByRole('heading')).toHaveTextContent('Search');
    expect(spy).not.toHaveBeenCalled();

    delete window.xssSpy;
  });

  it('should render entity encoded markup as literal text', () => {
    const { container, getByRole } = render(
      <AppBarTitle title={'&lt;img src=x onerror=alert(1)&gt;'} />
    );

    expect(container.querySelector('img')).toBeNull();
    expect(getByRole('heading')).toHaveTextContent('<img src=x onerror=alert(1)>');
  });
});
