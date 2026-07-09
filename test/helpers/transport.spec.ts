/*!
 * getTransport() Function Unit Tests
 *
 * I'm Queue Software Project
 * Copyright (C) 2026  imqueue.com <support@imqueue.com>
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
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { transports } from 'winston';
import { getTransport } from '../..';

describe('helpers/getTransport()', () => {
    it('should be a function', () => {
        assert.equal(typeof getTransport, 'function');
    });

    it('should construct a file transport', () => {
        const transport = getTransport('file', {
            filename: join(tmpdir(), 'imq-async-logger-test.log'),
        } as any);

        assert.ok(transport instanceof transports.File);
    });

    it('should construct an http transport', () => {
        const transport = getTransport('http', {} as any);

        assert.ok(transport instanceof transports.Http);
    });

    it('should return null for an unknown transport type', () => {
        assert.equal(getTransport('unknown', {} as any), null);
    });
});
