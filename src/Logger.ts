/*!
 * Copyright (c) 2018, imqueue.com <support@imqueue.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
import { ILogger, JsonObject } from '@imqueue/core';
import {
    createLogger,
    format,
    Logger as WinstonLogger,
    LoggerOptions,
} from 'winston';
import {
    buildMessage,
    defaultMetadata,
    getTransport,
    transportsConfig,
} from './helpers';
import { TransportOptions } from './TransportOptions';

export interface AsyncLoggerOptions {
    transports: TransportOptions[],
    metadata: JsonObject,
}

/**
 * Class Logger
 */
export class Logger implements ILogger {

    /**
     * Asynchronous console async-logger
     *
     * @type {ILogger}
     */
    private static readonly console: ILogger = {
        log: (...args: any[]) => setTimeout(() => console.log(...args)),
        info: (...args: any[]) => setTimeout(() => console.log(...args)),
        warn: (...args: any[]) => setTimeout(() => console.log(...args)),
        error: (...args: any[]) => setTimeout(() => console.log(...args)),
    };

    /**
     * @description
     * Configuring options of async-logger
     *
     * @returns {LoggerOptions}
     */
    private static getLoggerOptions(metadata?: JsonObject): LoggerOptions {
        return {
            exitOnError: false,
            format: format.json(),
            defaultMeta: metadata || defaultMetadata(),
        };
    }

    /**
     * Winston based async-logger having different logging transports
     *
     * @type {WinstonLogger}
     */
    private readonly logger: WinstonLogger;

    /**
     * Logger Ctor
     *
     * @constructor
     * @param {AsyncLoggerOptions} options
     */
    constructor(options?: AsyncLoggerOptions) {
        const opts = Logger.getLoggerOptions((options || {}).metadata);
        const config = (options || {}).transports || transportsConfig();

        if (config && config.length) {
            this.logger = createLogger(opts);
            this.setupLogger(config);
        }
    }

    /**
     * Logs given arguments to configured async-logger destinations and to stdout
     * with log level = LOG
     *
     * @param {...*[]} args
     */
    public log(...args: any[]): void {
        Logger.console.log(...args);

        if (this.logger) {
            this.logger.info(buildMessage(args));
        }
    }

    /**
     * Logs given arguments to configured async-logger destinations and to stdout
     * with log level = INFO
     *
     * @param {...*[]} args
     */
    public info(...args: any[]): void {
        Logger.console.info(...args);

        if (this.logger) {
            this.logger.info(buildMessage(args));
        }
    }

    /**
     * Logs given arguments to configured async-logger destinations and to stderr
     * with log level = WARN
     *
     * @param {...*[]} args
     */
    public warn(...args: any[]): void {
        Logger.console.warn(...args);

        if (this.logger) {
            this.logger.warn(buildMessage(args));
        }
    }

    /**
     * Logs given arguments to configured async-logger destinations and to stderr
     * with log level = ERROR
     *
     * @param {...*[]} args
     */
    public error(...args: any[]): void {
        Logger.console.error(...args);

        if (this.logger) {
            this.logger.error(buildMessage(args));
        }
    }

    /**
     * Configuring transports of async-logger
     *
     * @param {TransportOptions[]} config - configuration for transports from
     *                             environment variables
     */
    private setupLogger(config: TransportOptions[]): void {
        if (!config || !Array.isArray(config)) {
            throw new TypeError('Logger: Invalid config provided!');
        }

        for (const options of config) {
            if (!options.enabled) {
                continue;
            }

            const transport = getTransport(options.type, options.options);

            this.logger.add(transport);
        }
    }
}
