/** An image or video of the product media gallery. */
export interface ProductMediaItem {
  type: 'image' | 'video';
  url: string;
  altText?: string | null;
}
