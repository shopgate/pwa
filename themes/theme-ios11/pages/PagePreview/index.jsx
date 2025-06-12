import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { View } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import { Widgets } from '@shopgate/engage/page/components';
import { makeGetPage, makeGetWidgetsFromPage } from '@shopgate/engage/page/selectors';
import { PAGE_PREVIEW_SLUG } from '@shopgate/engage/page/constants';

/**
 * The PagePreview component is used to display a preview of a page inside the next admin.
 * @returns {JSX.Element}
 */
const PagePreview = () => {
  const getPage = useMemo(() => makeGetPage({
    slug: PAGE_PREVIEW_SLUG,
  }), []);

  const getWidgetsFromPage = useMemo(() => makeGetWidgetsFromPage({
    slug: PAGE_PREVIEW_SLUG,
  }), []);

  const page = useSelector(getPage);
  const widgetList = useSelector(getWidgetsFromPage);

  return (
    <View noContentPortal>
      <DefaultBar title={page?.data?.name || ''} />
      <Widgets widgets={widgetList} />
    </View>
  );
};

export default PagePreview;
