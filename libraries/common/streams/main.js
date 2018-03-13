import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import { mainSubject } from '../store/observable-middleware';

/**
 * Gets triggered on every redux action that is dispatched.
 * @type {Observable}
 */
export const main$ = Observable.from(mainSubject);
