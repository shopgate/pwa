import React from 'react';
import { render } from '@testing-library/react';
import Below from '../index';

jest.mock('../../../context');

describe('engage > components > view > components > below', () => {
  it('should render below', () => {
    const { container } = render(<Below />);
    expect(container).toBeTruthy();
  });
});
