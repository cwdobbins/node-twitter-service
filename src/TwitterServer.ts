import 'reflect-metadata';
import * as express from 'express';
import {Http} from './service/authentication.service';
import {ReflectiveInjector} from 'injection-js';
import {TwitterService} from './service/twitter.service';
import {environment} from './environments/environment';

class TwitterServer {
    public express;
    private twitter: TwitterService;

    constructor() {
        const injector = ReflectiveInjector.resolveAndCreate([TwitterService, Http]);
        this.twitter = injector.get(TwitterService);
        this.express = express();
        this.mountRoutes();
    }

    private addCorsHeaders(): (req, res, next) => void {
        return (req, res, next) => {
            res.set("Access-Control-Allow-Origin", req.get('Origin'));
            res.set("Access-Control-Allow-Methods", "*");
	        res.set("Access-Control-Allow-Headers", "*");
	        next();
        }
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.use(this.addCorsHeaders());
        router.get('/tweets/:username/:count', (req, res) => {
            this.twitter.getTweets(req.params.username, req.params.count || environment.defaultTweetCount)
                .subscribe(tweets => res.json(tweets));
        });
        this.express.use(router);
    }
}

export default new TwitterServer().express;
