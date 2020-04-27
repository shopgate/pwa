import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';

export const wrapper = css(useScrollContainer() ? {} : { paddingTop: 100 }).toString();
