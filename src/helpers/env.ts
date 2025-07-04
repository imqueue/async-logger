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
import { JsonObject } from '@imqueue/core';
import { resolve } from 'path';
import { existsSync as exists } from 'fs';
import { TransportOptions } from '../TransportOptions';

const RX_NAME = /%name/g;
const RX_VERSION = /%version/g;

/**
 * Retrieve package name and version from package.json of running service
 *
 * @returns {name: string, value: string} - return package name and version
 */
export function pkg(): { name: string; version: string; } {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const { name, version } = exists(pkgPath)
        ? require(pkgPath)
        : { name: 'logger', version: '' };

    return { name, version };
}

/**
 * Used for retrieve transport config from environment variables
 *
 * @returns {TransportOptions[]}
 */
export function transportsConfig(): TransportOptions[] {
    const { name, version } = pkg();

    try {
        return JSON.parse((process.env.LOGGER_TRANSPORTS || '[]')
            .replace(RX_NAME, name)
            .replace(RX_VERSION, version)
        );
    } catch (err) {
        throw new TypeError(`Logger: can not parse transports config: ${
            err.stack ? err.stack : err.message
        }`);
    }
}

/**
 * Returns default metadata, configured by environment variables
 *
 * @returns {JsonObject}
 */
export function defaultMetadata(): JsonObject {
    const { name, version } = pkg();

    try {
        return JSON.parse((process.env.LOGGER_METADATA || '{}')
            .replace(RX_NAME, name)
            .replace(RX_VERSION, version)
        );
    } catch (err) {
        throw new TypeError(`Logger: can not parse metadata: ${
            err.stack ? err.stack : err.message
        }`);
    }
}
