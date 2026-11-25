import React from 'react';
import { render } from '@testing-library/react';
import { ParallaxProvider as ParallaxProviderCmp } from 'react-scroll-parallax';
import ParallaxProvider from './index';

jest.mock('react-scroll-parallax', () => ({
  ParallaxProvider: jest.fn(({ children }) => children),
  useParallaxController: () => ({ update: jest.fn() }),
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useElementSize: () => ({ height: 0 }),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  applyScrollContainer: () => true,
}));
jest.mock('@shopgate/engage/a11y/hooks', () => ({
  useReduceMotion: () => false,
}));
jest.mock('@shopgate/engage/components/View', () => ({
  ViewContext: jest.requireActual('react').createContext({ contentRef: { current: null } }),
}));

describe('engage > components > view > ParallaxProvider', () => {
  it('should not leak a ResizeObserver of parallax-controller by enabling the controller only after mount', () => {
    render((
      <ParallaxProvider viewVisible>
        <div>Content</div>
      </ParallaxProvider>
    ));

    const disabledStates = ParallaxProviderCmp.mock.calls.map(([props]) => props.isDisabled);
    expect(disabledStates[0]).toBe(true);
    expect(disabledStates[disabledStates.length - 1]).toBe(false);
  });
});
