export interface Shape {
  borderRadius: number | string;
  /**
   * Corner radius of cards (product cards, content cards).
   */
  cardsBorderRadius: number | string;
  /**
   * Corner radius of product tiles in the product grid.
   */
  tilesBorderRadius: number | string;
}

export type ShapeOptions = Partial<Shape>;

const shape = {
  borderRadius: 4,
  cardsBorderRadius: 10,
  tilesBorderRadius: 0,
};

/**
 * Creates a shape object based on the provided options, with defaults for any missing values.
 * @param options The shape options to customize the shape object.
 * @returns A shape object with the specified options and defaults for any missing values.
 */
export default function createShape(options: ShapeOptions = {}): Shape {
  return {
    ...shape,
    ...options,
  };
}
