import { appWillStart$ } from '@shopgate/engage/core/streams';
import { receivePageConfigV2 } from '@shopgate/engage/page/action-creators';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';

const mockPage = {
  code: '7816f0f4-3202-4df1-94a1-c78115e723ea',
  name: 'FAQ',
  slug: 'faq',
  type: 'cms',
  dropzones: [
    {
      dropzone: 'cmsWidgetList',
      widgetList: [
        {
          code: '3102a2aa-a2e6-43bd-a43c-7e19df6d6825',
          widgetConfigDefinitionCode: '@shopgate/widgets/headlineWidget',
          widgetConfig: {
            headline: 'FAQ',
          },
          visibility: {
            scheduleStartDate: null,
            scheduleEndDate: null,
          },
          layout: {
            marginTop: 2,
            marginBottom: null,
            marginLeft: null,
            marginRight: null,
          },
        },
        {
          code: '3b99788b-2c34-4c23-a3ba-e089355fcc68',
          widgetConfigDefinitionCode: '@shopgate/widgets/richTextWidget',
          widgetConfig: {
            text: '<ul><li><p style="text-align: left">Wie viel kostet der Versand?</p><ul><li><p style="text-align: left">Unter 50€ kostet der Versand 4,99€, darüber ist Versandkostenfrei.</p></li></ul></li><li><p style="text-align: left">Wie sieht es mit Rückgabe aus?</p><ul><li><p style="text-align: left">Wir halten uns an die gesetzlichen 14 Tage Widerrufsrecht. Versandkosten für Rückversand trägt der Käufer.</p></li></ul></li></ul>',
          },
          visibility: {
            scheduleStartDate: null,
            scheduleEndDate: null,
          },
          layout: {
            marginTop: null,
            marginBottom: null,
            marginLeft: null,
            marginRight: null,
          },
        },
        {
          code: '12ee4bd8-8819-43af-8a53-efe7cee9a5e7',
          widgetConfigDefinitionCode: '@shopgate/widgets/productSliderWidget',
          widgetConfig: {
            productSelectorType: 'category',
            sort: 'relevance',
            slideAutomatic: true,
            endlessSlider: true,
            showName: true,
            showPrice: false,
            showRating: false,
            sliderSpeed: 7000,
            productsSearchTerm: 'topseller',
            productsCategory: 'CATEGORY-CODE',
            productCount: 12,
          },
          visibility: {
            scheduleStartDate: '2025-05-28T16:00:00Z',
            scheduleEndDate: '2025-05-29T16:00:00Z',
          },
          layout: {
            marginTop: null,
            marginBottom: null,
            marginLeft: null,
            marginRight: null,
          },
        },
      ],
    },
  ],
};

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    dispatch(receivePageConfigV2({
      type: 'cms',
      slug: PAGE_PREVIEW_SLUG,
      data: mockPage,
    }));
  });
}
