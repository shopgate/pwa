import type React from 'react';
import type { VariantRendererProps, VariantRendererType } from './types';

type VariantRenderer = React.ComponentType<VariantRendererProps>;

const renderers = new Map<VariantRendererType, VariantRenderer>();

/**
 * Registers a component that renders a characteristic for the given display type.
 * Registering an existing type replaces the built-in renderer.
 * @param type The display type.
 * @param component The renderer component.
 */
export const registerVariantRenderer = (
  type: VariantRendererType,
  component: VariantRenderer
): void => {
  renderers.set(type, component);
};

/**
 * Returns the renderer registered for a display type.
 * @param type The display type.
 * @returns The renderer or null.
 */
export const getVariantRenderer = (type: VariantRendererType): VariantRenderer | null =>
  renderers.get(type) ?? null;
