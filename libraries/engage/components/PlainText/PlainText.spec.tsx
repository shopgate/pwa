import React from 'react';
import noop from 'lodash/noop';
import { render, screen } from '@testing-library/react';
import PlainText from './PlainText';

describe('engage > components > PlainText', () => {
  it('should render decoded entities', () => {
    render(<p><PlainText text={'Tom &amp; Jerry &quot;Deluxe&quot;'} /></p>);

    expect(screen.getByText('Tom & Jerry "Deluxe"')).toBeInTheDocument();
  });

  it('should render markup as text without the tags', () => {
    const { container } = render(<p><PlainText text="<b>Bold</b> name" /></p>);

    expect(container.innerHTML).toBe('<p>Bold name</p>');
  });

  it('should render encoded markup as text', () => {
    const { container } = render(<p><PlainText text={'&lt;img src=x onerror=alert(1)&gt;'} /></p>);

    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });

  it('should not create elements or run scripts for malicious input', () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(noop);
    const { container } = render(
      <p><PlainText text="<img src=x onerror=alert(1)><svg onload=alert(1)></svg>Name" /></p>
    );

    expect(container.innerHTML).toBe('<p>Name</p>');
    expect(alert).not.toHaveBeenCalled();
  });

  it('should render nothing without a text', () => {
    const { container } = render(<p><PlainText /></p>);

    expect(container.innerHTML).toBe('<p></p>');
  });
});
