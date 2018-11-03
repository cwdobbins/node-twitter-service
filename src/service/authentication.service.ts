import 'reflect-metadata';
import axios from 'axios';
import {environment} from '../environments/environment';
import {Injectable} from 'injection-js';
import {map, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Injectable()
export class Authenticator {
    private authOptions: any;

    constructor(private http: any) {
        let basicAuthKey = btoa(`${environment.twitterAppKey}:${environment.twitterAppSecretKey}`);

        this.authOptions = {
            method: 'POST',
            headers: {
                'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': `Basic ${basicAuthKey}`
            },
            url: `${environment.twitterApiBaseUrl}/oath2/token`,
            data: "grant_type=client_credentials",
            json: true
        };

    }

    public isAuthRequest(requestConfig: any): boolean {
        console.log('Is Auth Request', request);
        return requestConfig.data === this.authOptions.data;
    }

    // .pipe(
    //     tap((response: any) => localStorage.setItem('bearerToken', response.access_token)),
    //     map(_ => localStorage.getItem('bearerToken'))
    // )

    public getToken() {
        if (localStorage.getItem('bearerToken')) {
            return Observable.of(localStorage.getItem('bearerToken'));
        }
        return this.http.post(this.authOptions).then(
            response => {
                console.log('Axios response', response);
                return 'bad token';
            }
        )
    }
}

@Injectable()
export class TokenInterceptor {
    constructor(private auth: Authenticator, private http: any) {
        this.http.interceptors.request.use((requestConfig) => {
           if (this.auth.isAuthRequest(requestConfig))  {
               return requestConfig;
           } else {
               return new Promise((resolve) => {
                  this.auth.getToken().then(token => {
                      requestConfig.headers['Authorization'] = `Bearer ${token}`;
                      return requestConfig;
                  });
               });
           }
        });
    }
}

