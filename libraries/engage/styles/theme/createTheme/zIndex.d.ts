export interface ZIndex {
  tabBar: number;
  drawer: number;
  snackbar: number;
  modal: number;
}

export type ZIndexOptions = Partial<ZIndex>;

declare const zIndex: ZIndex;

export default zIndex;
