import gulp from 'gulp';
import path from 'path';
import express from 'express';
import morgan from 'morgan';

export default (config) => {
    return () => {
        let server = express();

        server.use(morgan('dev'));

        server.use( express.static( config.source ) );

        server.listen(config.port, () => {
            console.log(`Static server listening on port ${config.port}`);
        });
    };
};