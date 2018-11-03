import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export class TwitterUser {
    public description: string;
    public id: number;
    public name: string;
    public location: string;
    public avatarUrl: string;
    public handle: string;

    constructor(user: any) {
        this.description = user.description;
        this.id = user.id;
        this.name = user.name;
        this.location = user.location;
        this.avatarUrl = user.profile_image_url;
        this.handle = user.screen_name;
    }
}

export class Tweet {
    public created: string;
    public likes: number;
    public id: string;
    public text: string;
    public truncated; boolean;
    public user: TwitterUser;
    public entities: any;

    constructor(twitterData: any) {
        this.created = twitterData.created_at;
        this.likes = twitterData.favorite_count;
        this.id = twitterData.id_str;
        this.text = twitterData.text;
        this.truncated = twitterData.truncated;
        this.user = new TwitterUser(twitterData.user);
        this.entities = twitterData.entities;
    }
}

@Injectable()
export class TwitterService {
    private timelineUrl = `${environment.twitterApiBaseUrl}/1.1/statuses/user_timeline.json`;

    constructor(private http: HttpClient) {
        this.getTweets(environment.twitterAccount, 1);
    }

    public getTweets(username: string, count: number): Observable<Tweet[]> {
        return this.http.get(`${this.timelineUrl}?screen_name=${username}&count=${count}&exclude_replies=true&include_rts=true`).pipe(
            map((data: []) => data.map(it => new Tweet(it)))
        );
    }
}

