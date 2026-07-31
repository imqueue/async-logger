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
import { type JsonObject } from '../types.js';
import { resolve } from 'path';
import { existsSync as exists, readFileSync } from 'fs';
import { type TransportOptions } from '../TransportOptions.js';

const RX_NAME = /%name/g;
const RX_VERSION = /%version/g;

/**
 * Reads the running service's own name and version, used to expand the `%name`
 * and `%version` placeholders in the logger environment variables.
 *
 * @remarks
 * Resolved from `package.json` in the process's CURRENT WORKING DIRECTORY, not
 * from this package's location. A service started from a different directory
 * therefore reports whatever it finds there, and one started somewhere with no
 * `package.json` falls back to `{ name: 'logger', version: '' }` rather than
 * failing.
 *
 * @returns the service name and version, or the fallback pair
 */
export function pkg(): { name: string; version: string } {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const { name, version } = exists(pkgPath)
        ? JSON.parse(readFileSync(pkgPath, 'utf8'))
        : { name: 'logger', version: '' };

    return { name, version };
}

/**
 * Parses the transport declarations out of `LOGGER_TRANSPORTS`, expanding
 * `%name` and `%version` first.
 *
 * @remarks
 * An unset variable yields an empty array, which the {@link Logger} treats as
 * console-only rather than as an error — the normal local-development case.
 * Malformed JSON, by contrast, throws: a config typo should fail loudly at
 * start-up rather than silently drop a production log destination.
 *
 * @returns the declared transports, or an empty array when unset
 * @throws TypeError if the variable is set but not parseable as JSON
 */
export function transportsConfig(): TransportOptions[] {
    const { name, version } = pkg();

    try {
        return JSON.parse(
            (process.env.LOGGER_TRANSPORTS || '[]')
                .replace(RX_NAME, name)
                .replace(RX_VERSION, version),
        );
    } catch (err) {
        throw new TypeError(
            `Logger: can not parse transports config: ${
                err instanceof Error ? err.stack || err.message : String(err)
            }`,
        );
    }
}

/**
 * Parses the default record metadata out of `LOGGER_METADATA`, expanding `%name`
 * and `%version` first.
 *
 * @remarks
 * These fields are attached to every record sent to a transport — a source tag,
 * an environment name, a hostname — and are what makes records from several
 * services distinguishable at the collector. Console output is unaffected.
 *
 * @returns the parsed metadata, or an empty object when unset
 * @throws TypeError if the variable is set but not parseable as JSON
 */
export function defaultMetadata(): JsonObject {
    const { name, version } = pkg();

    try {
        return JSON.parse(
            (process.env.LOGGER_METADATA || '{}')
                .replace(RX_NAME, name)
                .replace(RX_VERSION, version),
        );
    } catch (err) {
        throw new TypeError(
            `Logger: can not parse metadata: ${
                err instanceof Error ? err.stack || err.message : String(err)
            }`,
        );
    }
}
