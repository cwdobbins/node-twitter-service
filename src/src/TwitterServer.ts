import * as express from 'express';

class TwitterServer {
    public express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            })
        });
        this.express.use('/', router);
    }
}

export default new TwitterServer().express;
