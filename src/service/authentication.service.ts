import 'reflect-metadata';
import axios from 'axios';
import {environment} from '../environments/environment';
import {Injectable} from 'injection-js';

@Injectable()
export class Http {
    public service;
    constructor() {
        this.service = axios.create();
        let authenticator = new Authenticator(this.service);
        let interceptor = new TokenInterceptorFactory(authenticator);
        this.service.interceptors.request.use(interceptor.getInterceptor());
    }
}


class Authenticator {
    private authOptions: any;
    private cachedToken: string;

    constructor(private httpService: any) {
        let basicAuthKey = Buffer.from(`${environment.twitterAppKey}:${environment.twitterAppSecretKey}`).toString('base64');

        this.authOptions = {
            method: 'POST',
            headers: {
                'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': `Basic ${basicAuthKey}`
            },
            url: `${environment.twitterApiBaseUrl}/oauth2/token`,
            data: "grant_type=client_credentials",
            json: true
        };

    }

    public isAuthRequest(requestConfig: any): boolean {
        return requestConfig.data === this.authOptions.data;
    }

    public getToken() {
        if (this.cachedToken) {
            return Promise.resolve(this.cachedToken);
        }
        return this.httpService(this.authOptions).then(
            response => {
                this.cachedToken = response.data.access_token;
                return response.data.access_token;
            }
        ).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    }
}

class TokenInterceptorFactory {
    constructor(private auth: Authenticator) {}

    public getInterceptor() {
        return (requestConfig) => {
            if (this.auth.isAuthRequest(requestConfig))  {
                return requestConfig;
            } else {
                return new Promise((resolve) => {
                    this.auth.getToken().then(token => {
                        requestConfig.headers['Authorization'] = `Bearer ${token}`;
                        return requestConfig;
                    }).then(tokenizedRequest => resolve(tokenizedRequest));
                });
            }
        };
    }
}

