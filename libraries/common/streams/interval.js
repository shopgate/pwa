import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

/**
 * Gets triggered every minute.
 * @type {Observable}
 */
export const minute$ = Observable.interval(60000);
