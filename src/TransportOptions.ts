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
import { type LoggerOptions } from 'winston';

/**
 * One transport declaration — the shape of each element in the
 * `LOGGER_TRANSPORTS` JSON array.
 *
 * @example
 * ```json
 * {
 *     "type": "http",
 *     "options": {
 *         "ssl": true,
 *         "port": 443,
 *         "host": "http-intake.logs.datadoghq.com",
 *         "path": "/v1/input/<API_KEY>"
 *     },
 *     "enabled": true
 * }
 * ```
 */
export interface TransportOptions {
    /**
     * Which transport to create: `'file'` or `'http'`. Any other value is
     * rejected at construction time.
     */
    type: string;

    /**
     * Options handed to the winston transport constructor — `filename` for
     * `file`, `host`/`port`/`path`/`ssl` for `http`.
     *
     * @remarks
     * Typed as winston's `LoggerOptions` for historical reasons, which is wider
     * than what is actually accepted here. Treat it as `FileTransportOptions` or
     * `HttpTransportOptions` according to `type`; the declared type will not
     * catch a mismatch for you.
     */
    options: LoggerOptions;

    /**
     * Whether to attach this transport. A `false` entry is skipped entirely, so
     * a transport can be left in the config and switched off per environment
     * rather than deleted.
     */
    enabled: boolean;
}
