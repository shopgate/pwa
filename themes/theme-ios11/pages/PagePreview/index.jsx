import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { View } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import { WidgetList } from '@shopgate/engage/widgets/components';
import { makeGetPage, makeGetWidgetListFromPage } from '@shopgate/engage/page/selectors';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';

/**
 * The PagePreview component is used to display a preview of a page inside the next admin.
 * @returns {JSX.Element}
 */
const PagePreview = () => {
  const getPage = useMemo(() => makeGetPage({
    slug: PAGE_PREVIEW_SLUG,
  }), []);

  const getWidgetListFromPage = useMemo(() => makeGetWidgetListFromPage({
    slug: PAGE_PREVIEW_SLUG,
  }), []);

  const page = useSelector(getPage);
  const widgetList = useSelector(getWidgetListFromPage);

  return (
    <View noContentPortal>
      <DefaultBar title={page?.data?.name || ''} />
      <WidgetList widgets={widgetList} />
    </View>
  );
};

export default PagePreview;
