/*!
 * I'm Queue Software Project
 * Copyright (C) 2025  imqueue.com <support@imqueue.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * If you want to use this code in a closed source (commercial) project, you can
 * purchase a proprietary commercial license. Please contact us at
 * <support@imqueue.com> to get commercial licensing options.
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
