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
import { type ILogger, type JsonObject } from './types.js';
import {
    createLogger,
    format,
    Logger as WinstonLogger,
    type LoggerOptions,
} from 'winston';
import {
    buildMessage,
    defaultMetadata,
    getTransport,
    transportsConfig,
} from './helpers/index.js';
import { type TransportOptions } from './TransportOptions.js';

/**
 * Explicit configuration for a {@link Logger}, replacing what it would otherwise
 * read from the environment.
 *
 * @remarks
 * Both fields are read independently: pass only `metadata` and the transports
 * still come from `LOGGER_TRANSPORTS`, and vice versa. Passing an empty
 * `transports` array is not the same as omitting it — an empty array means
 * "console only", while omitting it falls back to the environment.
 */
export interface AsyncLoggerOptions {
    /**
     * Transports to log through. Each entry is created and attached at
     * construction time; entries with `enabled: false` are skipped.
     */
    transports: TransportOptions[];

    /**
     * Fields attached to every record sent to a transport, such as a source or
     * environment tag. Does not affect console output.
     */
    metadata: JsonObject;
}

/**
 * Logger that writes to the console without blocking the caller and forwards the
 * same records to any configured winston transports.
 *
 * @remarks
 * Implements {@link ILogger}, so it drops into anything in `@imqueue` that accepts
 * a logger — `IMQClient`, `IMQService`, `RedisCache` — replacing the default
 * synchronous console.
 *
 * Console output is scheduled with `setTimeout` rather than written inline. That
 * is the point of the package: a service logging heavily does not pay for it on
 * the request path. It also means ordering against synchronous code is not
 * guaranteed, and output queued at the moment of `process.exit()` is lost.
 *
 * Transports are optional. Constructed with none — the default when
 * `LOGGER_TRANSPORTS` is unset — this behaves as an async console logger and
 * never touches winston.
 *
 * @example
 * ```typescript
 * import { Logger } from '@imqueue/async-logger';
 *
 * // configured from LOGGER_TRANSPORTS / LOGGER_METADATA
 * const logger = new Logger();
 *
 * // or explicitly, e.g. to tag one subsystem differently
 * const audit = new Logger({
 *     transports: [{ type: 'file', options: { filename: 'audit.log' }, enabled: true }],
 *     metadata: { subsystem: 'audit' },
 * });
 *
 * audit.info('user %s signed in', userId);
 * ```
 */
export class Logger implements ILogger {
    /**
     * Console bound through `setTimeout`, so every write is deferred to a later
     * tick instead of blocking the caller.
     */
    private static readonly console: ILogger = {
        // oxlint-disable-next-line no-console -- forwarding is the API here
        log: (...args: any[]) => setTimeout(() => console.log(...args)),
        info: (...args: any[]) => setTimeout(() => console.info(...args)),
        warn: (...args: any[]) => setTimeout(() => console.warn(...args)),
        error: (...args: any[]) => setTimeout(() => console.error(...args)),
    };

    /**
     * Builds the winston options every transport shares: JSON formatting, the
     * given (or environment-derived) default metadata, and `exitOnError: false`
     * so a transport failure never takes the process down.
     *
     * @param metadata - fields to attach to every record; falls back to
     *                   `LOGGER_METADATA` when omitted
     * @returns winston logger options
     */
    private static getLoggerOptions(metadata?: JsonObject): LoggerOptions {
        return {
            exitOnError: false,
            format: format.json(),
            defaultMeta: metadata || defaultMetadata(),
        };
    }

    /**
     * The winston logger the transports are attached to. Left undefined when no
     * enabled transport was configured, which is how console-only mode is
     * represented — every method checks it before forwarding.
     */
    private readonly logger?: WinstonLogger;

    /**
     * @param options - explicit transports and metadata. Omit either half and it
     *                  is read from `LOGGER_TRANSPORTS` / `LOGGER_METADATA`; omit
     *                  the argument entirely and both are.
     * @throws TypeError if the environment config is not valid JSON, or names a
     *         transport type other than `file` or `http`
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
     * Logs to the console and to every configured transport.
     *
     * @remarks
     * Reaches transports at winston's `info` level — there is no distinct `log`
     * level — so records from here and from {@link Logger.info} are
     * indistinguishable once shipped. They differ only in the console method
     * used. Pick by the destination you care about.
     *
     * @param args - `console.log`-style arguments; the first may be a format
     *               string with `%s`/`%d`/`%j` placeholders for the rest
     */
    public log(...args: any[]): void {
        Logger.console.log(...args);

        if (this.logger) {
            this.logger.info(buildMessage(args));
        }
    }

    /**
     * Logs at INFO level — routine progress worth keeping.
     *
     * @param args - `console.info`-style arguments; the first may be a format
     *               string with `%s`/`%d`/`%j` placeholders for the rest
     */
    public info(...args: any[]): void {
        Logger.console.info(...args);

        if (this.logger) {
            this.logger.info(buildMessage(args));
        }
    }

    /**
     * Logs at WARN level — something recovered from, but worth seeing.
     *
     * @param args - `console.warn`-style arguments; the first may be a format
     *               string with `%s`/`%d`/`%j` placeholders for the rest
     */
    public warn(...args: any[]): void {
        Logger.console.warn(...args);

        if (this.logger) {
            this.logger.warn(buildMessage(args));
        }
    }

    /**
     * Logs at ERROR level.
     *
     * @remarks
     * Pass an `Error` and it is formatted like the console would — including the
     * stack. Passing `error.stack` explicitly is the usual choice when the record
     * has to stay one line for a log shipper.
     *
     * @param args - `console.error`-style arguments; the first may be a format
     *               string with `%s`/`%d`/`%j` placeholders for the rest
     */
    public error(...args: any[]): void {
        Logger.console.error(...args);

        if (this.logger) {
            this.logger.error(buildMessage(args));
        }
    }

    /**
     * Creates and attaches each enabled transport from the given config.
     *
     * @param config - transport definitions, from {@link AsyncLoggerOptions} or
     *                 parsed out of `LOGGER_TRANSPORTS`
     * @throws TypeError if `config` is not an array, or an enabled entry names a
     *         transport type other than `file` or `http`
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

            // getTransport() yields nothing for a type it does not know. Report
            // the offending type here: winston would otherwise reject the null
            // with "Invalid transport, must be an object with a log method",
            // which names neither the type nor the config it came from.
            if (!transport) {
                throw new TypeError(
                    `Logger: unknown transport type "${
                        options.type
                    }", expected "file" or "http"!`,
                );
            }

            // the constructor always creates the winston logger before
            // calling setupLogger(), the optional chaining only satisfies
            // strict property-initialization analysis
            this.logger?.add(transport);
        }
    }
}
