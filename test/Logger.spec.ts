/*!
 * Logger Class Unit Tests
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
import { describe, it, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import logger, { Logger } from '../index.js';

const LOG_FILE = join(tmpdir(), 'imq-async-logger-test.log');

// Logger.console defers console calls with setTimeout, so console mocks
// must be awaited past the timer before asserting
function tick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 10));
}

describe('Logger', () => {
    it('should be a class', () => {
        assert.equal(typeof Logger, 'function');
    });

    it('should expose a default instance as the package default export', () => {
        assert.ok(logger instanceof Logger);
    });

    it('should not create a winston logger without transports', () => {
        const log = new Logger();

        assert.equal((log as any).logger, undefined);
    });

    it('should create a winston logger with configured transports', () => {
        const log = new Logger({
            metadata: {},
            transports: [
                {
                    type: 'file',
                    enabled: true,
                    options: { filename: LOG_FILE } as any,
                },
            ],
        });

        assert.ok((log as any).logger);
        assert.equal((log as any).logger.transports.length, 1);
    });

    it('should skip disabled transports', () => {
        const log = new Logger({
            metadata: {},
            transports: [
                {
                    type: 'file',
                    enabled: false,
                    options: { filename: LOG_FILE } as any,
                },
            ],
        });

        assert.ok((log as any).logger);
        assert.equal((log as any).logger.transports.length, 0);
    });

    it('should throw a TypeError on a non-array transports config', () => {
        assert.throws(
            () => new Logger({ transports: 'broken' as any, metadata: {} }),
            { name: 'TypeError', message: /Invalid config/ },
        );
    });

    for (const [method, consoleMethod] of [
        ['log', 'log'],
        ['info', 'info'],
        ['warn', 'warn'],
        ['error', 'error'],
    ] as const) {
        it(`should async-forward ${method}() to console.${consoleMethod}()`, async (t: TestContext) => {
            const mocked = t.mock.method(console, consoleMethod);
            const log = new Logger();

            (log as any)[method]('message', 42);

            assert.equal(mocked.mock.calls.length, 0);
            await tick();
            assert.equal(mocked.mock.calls.length, 1);
            assert.deepEqual(mocked.mock.calls[0].arguments, ['message', 42]);
        });

        it(`should pass ${method}() through the winston logger`, async (t: TestContext) => {
            t.mock.method(console, consoleMethod);

            const log = new Logger({
                metadata: {},
                transports: [
                    {
                        type: 'file',
                        enabled: true,
                        options: { filename: LOG_FILE } as any,
                    },
                ],
            });
            const winston = (log as any).logger;
            const level = method === 'log' ? 'info' : method;
            const mocked = t.mock.method(winston, level);

            (log as any)[method]('formatted %s', 'value');

            assert.equal(mocked.mock.calls.length, 1);
            assert.deepEqual(mocked.mock.calls[0].arguments, [
                'formatted value',
            ]);
            await tick();
        });
    }
});
