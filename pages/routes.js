import Loadable from 'react-loadable';

export const Page = Loadable({
  loader: () => import('./Page'),
  loading: () => null,
});

export const RootCategory = Loadable({
  loader: () => import('./RootCategory'),
  loading: () => null,
});

// Export const Category = Loadable({
//   Loader: () => import('./Category'),
//   Loading: () => null,
// });

// Export const Filter = Loadable({
//   Loader: () => import('./Filter'),
//   Loading: () => null,
// });

// Export const FilterAttribute = Loadable({
//   Loader: () => import('./FilterAttribute'),
//   Loading: () => null,
// });

// Export const Product = Loadable({
//   Loader: () => import('./Product'),
//   Loading: () => null,
// });

// Export const ProductGallery = Loadable({
//   Loader: () => import('./ProductGallery'),
//   Loading: () => null,
// });

// Export const Reviews = Loadable({
//   Loader: () => import('./Reviews'),
//   Loading: () => null,
// });

export const Cart = Loadable({
  loader: () => import('./Cart'),
  loading: () => null,
});

// Export const Favorites = Loadable({
//   Loader: () => import('./Favorites'),
//   Loading: () => null,
// });

// Export const Search = Loadable({
//   Loader: () => import('./Search'),
//   Loading: () => null,
// });

// Export const Login = Loadable({
//   Loader: () => import('./Login'),
//   Loading: () => null,
// });

// Export const Orders = Loadable({
//   Loader: () => import('./Orders'),
//   Loading: () => null,
// });

// Export const WriteReview = Loadable({
//   Loader: () => import('./WriteReview'),
//   Loading: () => null,
// });
