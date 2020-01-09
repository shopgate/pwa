/* eslint-disable extra-rules/no-commented-out-code */
import { lazy } from 'react';

export const StartPage = lazy(() => import(/* webpackChunkName: "startpage" */ './StartPage'));
export const Page = lazy(() => import(/* webpackChunkName: "page" */ './Page'));
export const RootCategory = lazy(() => import(/* webpackChunkName: "root-category" */ './RootCategory'));
export const Category = lazy(() => import(/* webpackChunkName: "category" */ './Category'));
export const Filter = lazy(() => import(/* webpackChunkName: "filter" */ './Filter'));
export const Product = lazy(() => import(/* webpackChunkName: "product" */ './Product'));
export const ProductGallery = lazy(() => import(/* webpackChunkName: "product-gallery" */ './ProductGallery'));
export const Reviews = lazy(() => import(/* webpackChunkName: "reviews" */ './Reviews'));
export const Cart = lazy(() => import(/* webpackChunkName: "cart" */ './Cart'));
export const Favorites = lazy(() => import(/* webpackChunkName: "favorites" */ './Favorites'));
export const Search = lazy(() => import(/* webpackChunkName: "search" */ './Search'));
export const Login = lazy(() => import(/* webpackChunkName: "login" */ './Login'));
export const WriteReview = lazy(() => import(/* webpackChunkName: "write-review" */ './WriteReview'));
export const Scanner = lazy(() => import(/* webpackChunkName: "scanner" */ './Scanner'));

/* eslint-enable extra-rules/no-commented-out-code */
