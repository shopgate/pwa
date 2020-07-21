import React, { useContext, forwardRef } from 'react';
import { CardList } from '@shopgate/engage/components';
import { StoreFinderContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import StoreFinderLocation from './StoreFinderLocation';
import { cardList, card } from './StoreFinderLocations.style';

/**
 * @param {Object} props The component props
 * @param {Object} ref A forwarded ref
 * @returns {JSX}
 */
const StoreFinderLocations = (props, ref) => {
  const { locations } = useContext(StoreFinderContext);

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div ref={ref}>
      <CardList className={cardList}>
        {locations.map(location => (
          <CardList.Item className={card} key={location.code}>
            <StoreContext.Provider value={location}>
              <StoreFinderLocation />
            </StoreContext.Provider>
          </CardList.Item>
        ))}
      </CardList>
    </div>
  );
};

export default forwardRef(StoreFinderLocations);
