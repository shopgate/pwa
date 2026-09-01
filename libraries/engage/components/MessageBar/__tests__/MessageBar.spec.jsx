import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageBar } from '../index';

const MESSAGE1 = 'This is some information';
const MESSAGE2 = 'This is an error that happened here.';
const MESSAGE3 = 'This is just a warning. Nothing to freak out about.';
const MESSAGE4 = 'Normal pre-translated message.';
const MESSAGE5 = 'Normal pre-translated message two.';
const MESSAGE6 = 'some.translation.string';
const MESSAGE7 = 'Message with messageParams';

jest.mock('@shopgate/engage/styles/helpers', () => {
  const originalModule = jest.requireActual('@shopgate/engage/styles/helpers');

  return {
    ...originalModule,
    getCSSCustomProp: (prop) => {
      if (prop === '--color-secondary') {
        return '#5ccee3';
      }

      return originalModule.getCSSCustomProp(prop);
    },
  };
});

describe('<MessageBar />', () => {
  describe('General rendering', () => {
    it('should be empty if no messages have been set', () => {
      render(<MessageBar messages={[]} />);
      expect(screen.queryByRole('alert')).toBeNull();
      expect(document.querySelectorAll('[aria-live="assertive"]')).toHaveLength(0);
    });

    it('should render a message as info if type is missing', () => {
      render(<MessageBar messages={[{ message: 'something' }]} />);
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText('something')).toBeTruthy();
    });
  });

  describe('Multiple messages rendering', () => {
    it('should render messages without frontend translation', () => {
      render(<MessageBar
        messages={[
          {
            type: 'info',
            message: MESSAGE1,
          },
          {
            type: 'error',
            message: MESSAGE2,
          },
          {
            type: 'warning',
            message: MESSAGE3,
          },
          {
            message: MESSAGE4,
            translated: null,
          },
          {
            message: MESSAGE5,
            translated: true,
          },
        ]}
      />);

      const alertContent = screen.getByRole('alert').textContent;
      const expectedOrder = [MESSAGE1, MESSAGE2, MESSAGE3, MESSAGE4, MESSAGE5];
      let previousIndex = -1;

      expectedOrder.forEach((message) => {
        const currentIndex = alertContent.indexOf(message);
        expect(currentIndex).toBeGreaterThan(previousIndex);
        previousIndex = currentIndex;
      });
    });

    it('should translate and render all given messages', () => {
      render(<MessageBar
        messages={[
          {
            message: MESSAGE6,
            translated: false,
          },
          {
            message: MESSAGE7,
            messageParams: {
              myCustomParam1: '-> TEST-VALUE #1 <-',
              myCustomParam2: '-> TEST-VALUE #2 <-',
            },
            translated: false,
          },
        ]}
      />);

      expect(screen.getByRole('alert')).toBeTruthy();
      expect(document.querySelectorAll('[aria-live="assertive"]')).toHaveLength(2);
    });
  });

  it('should render with custom classNames', () => {
    const { container } = render((
      <MessageBar
        messages={[{ message: MESSAGE1 }]}
        classNames={{
          container: 'cls-container',
          message: 'cls-message',
        }}
      />
    ));
    expect(container.firstChild).toHaveClass('cls-container');
    expect(container.querySelector('.cls-message')).not.toBeNull();
  });
});
