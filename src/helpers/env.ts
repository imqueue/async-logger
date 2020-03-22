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
