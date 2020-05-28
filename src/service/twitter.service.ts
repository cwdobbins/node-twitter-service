import {Injectable, ReflectiveInjector} from 'injection-js';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {Http} from './authentication.service';

@Injectable()
export class TwitterService {
    constructor(private http: Http) {}

    public getTweets(username: string, count: number): Observable<any[]> {
        let url = `${environment.apiBaseUrl}/1.1/statuses/user_timeline.json?screen_name=${username}&count=${count}&exclude_replies=true&include_rts=true`;
        console.log(`Retrieve ${count} most recent tweets for @${username}`);
        return Observable.create(observer => {
            console.log('Sending request', url);
            this.http.service.get(url)
                .then(response => response.data)
                .then(tweets => {
                    observer.next(tweets);
                    observer.complete();
                })
                .catch(error => observer.error('Could not retrieve tweets'))
        });
    }
}
