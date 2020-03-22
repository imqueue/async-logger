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
import { transports } from 'winston';
import * as Transport from 'winston-transport';
import {
    FileTransportOptions,
    HttpTransportOptions,
} from 'winston/lib/winston/transports';

/**
 * Used for get configured transport by type
 *
 * @param {string} type - transport type
 * @param {FileTransportOptions | HttpTransportOptions} options -
 *   options for configure transport
 * @returns {Transport}
 */
export function getTransport(
    type: string,
    options: FileTransportOptions | HttpTransportOptions,
): Transport {
    let transportInstance = null;

    if (type === 'file') {
        transportInstance = new transports.File(options);
    } else if (type === 'http') {
        transportInstance = new transports.Http(options);
    }

    return transportInstance as Transport;
}
