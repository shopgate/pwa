import Loadable from 'react-loadable';

export const StartPage = Loadable({
  loader: () => import('./StartPage'),
  loading: () => null,
});

export const Page = Loadable({
  loader: () => import('./Page'),
  loading: () => null,
});

export const RootCategory = Loadable({
  loader: () => import('./RootCategory'),
  loading: () => null,
});

export const Category = Loadable({
  loader: () => import('./Category'),
  loading: () => null,
});

export const Filter = Loadable({
  loader: () => import('./Filter'),
  loading: () => null,
});

export const FilterAttribute = Loadable({
  loader: () => import('./FilterAttribute'),
  loading: () => null,
});

export const Product = Loadable({
  loader: () => import('./Product'),
  loading: () => null,
});

export const ProductGallery = Loadable({
  loader: () => import('./ProductGallery'),
  loading: () => null,
});

export const Reviews = Loadable({
  loader: () => import('./Reviews'),
  loading: () => null,
});

export const Cart = Loadable({
  loader: () => import('./Cart'),
  loading: () => null,
});

export const Favorites = Loadable({
  loader: () => import('./Favorites'),
  loading: () => null,
});

export const Search = Loadable({
  loader: () => import('./Search'),
  loading: () => null,
});

export const Login = Loadable({
  loader: () => import('./Login'),
  loading: () => null,
});

export const WriteReview = Loadable({
  loader: () => import('./WriteReview'),
  loading: () => null,
});
