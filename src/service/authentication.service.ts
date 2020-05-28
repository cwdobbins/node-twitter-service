import 'reflect-metadata';
import axios from 'axios';
import * as cache from 'memory-cache';
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
    private cache = new cache.Cache();

    constructor(private httpService: any) {
        let basicAuthKey = Buffer.from(`${environment.clientId}:${environment.secretKey}`).toString('base64');

        this.authOptions = {
            method: 'POST',
            headers: {
                'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': `Basic ${basicAuthKey}`
            },
            url: `${environment.apiBaseUrl}/oauth2/token`,
            data: "grant_type=client_credentials",
            json: true
        };

    }

    public isAuthRequest(requestConfig: any): boolean {
        return requestConfig.data === this.authOptions.data;
    }

    public async getToken(): Promise<string> {
        if (this.cache.get('authToken')) {
            return Promise.resolve(this.cache.get('authToken'));
        }
        try {
            let response = await this.httpService(this.authOptions);
            this.cache.put('authToken', response.data.access_token, 86400000);
            return response.data.access_token;
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }
}

class TokenInterceptorFactory {
    constructor(private auth: Authenticator) {}

    public getInterceptor(): (any) => Promise<any> {
        return async (requestConfig) => {
            if (this.auth.isAuthRequest(requestConfig))  {
                return Promise.resolve(requestConfig);
            } else {
                let token = await this.auth.getToken();
                requestConfig.headers['Authorization'] = `Bearer ${token}`
                return requestConfig;
            }
        };
    }
}
