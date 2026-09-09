import React from 'react';
import { render } from '@testing-library/react';
import Above from '../index';

jest.mock('../../../context');

describe('engage > components > view > components > above', () => {
  it('should render above', () => {
    const { container } = render(<Above />);
    expect(container).toBeTruthy();
  });
});
