// import {HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import * as axios from 'axios';
import {environment} from '../environments/environment';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

export class Authenticator {
    private authOptions: any;
    private authUrl = `${environment.twitterApiBaseUrl}/oauth2/token`;
    private authBody = "grant_type=client_credentials";

    constructor(private http: HttpClient) {
        let basicAuthKey = btoa(`${environment.twitterAppKey}:${environment.twitterAppSecretKey}`);
        console.log('basicAuthKey:', basicAuthKey);
        this.authOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': `Basic ${basicAuthKey}`
            })
        };
        console.log('headers', this.authOptions.headers);
    }

    public isAuthRequest(request: HttpRequest<any>): boolean {
        return request.body === this.authBody;
    }

    public getToken(): Observable<string> {
        if (localStorage.getItem('bearerToken')) {
            return of(localStorage.getItem('bearerToken'));
        }
        return this.http.post(this.authUrl, this.authBody, this.authOptions).pipe(
                map((response: any) => response.access_token),
                tap(token => localStorage.setItem('bearerToken', token))
            );
    }
}


export class TokenInterceptor {

    constructor(private auth: Authenticator,
                private axios: any) {
        axios.interceptors.request.use((req) => {

        });
    }
}

    intercept(request: any): Observable<> {
        if (this.auth.isAuthRequest(request)) {
            return next.handle(request);
        }
        return this.auth.getToken().pipe(
            switchMap(token => {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next.handle(request);
            })
        );
    }
}
