/**
 * The options of a modal for `showModal`.
 */
export interface ModalOptions {
  /**
   * The title, a string or an i18n key. No React node, since the options go into the redux state.
   */
  title?: string | null;
  /**
   * I18n placeholder parameters for the title.
   */
  titleParams?: Record<string, unknown>;
  /**
   * The message.
   */
  message?: string | null;
  /**
   * The label of the confirm button, 'modal.confirm' when not set. Null hides the button.
   */
  confirm?: string | null;
  /**
   * The label of the dismiss button, 'modal.dismiss' when not set. Null hides the button.
   */
  dismiss?: string | null;
  /**
   * Whether the confirm button is disabled.
   */
  confirmDisabled?: boolean;
  /**
   * Whether the dismiss button is disabled.
   */
  dismissDisabled?: boolean;
  /**
   * The type of the dialog. It decides which component renders it.
   */
  type?: string | null;
  /**
   * Parameters for the component of the dialog type.
   */
  params?: Record<string, unknown>;
}
