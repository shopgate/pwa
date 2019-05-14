import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

/**
 * Gets triggered every second.
 * @type {Observable}
 */
export const second$ = Observable.interval(1000);
