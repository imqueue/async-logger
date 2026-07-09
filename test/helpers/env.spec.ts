/*!
 * Environment Helpers Unit Tests
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
import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { defaultMetadata, pkg, transportsConfig } from '../..';

// the package manifest of this repository, as pkg() should see it when the
// process runs from the repository root
const self = require('../../package.json');

describe('helpers/pkg()', () => {
    it('should return name and version of the current package', () => {
        assert.deepEqual(pkg(), {
            name: self.name,
            version: self.version,
        });
    });

    it('should fall back to defaults when no package.json exists', () => {
        const cwd = process.cwd();

        process.chdir(tmpdir());

        try {
            assert.deepEqual(pkg(), { name: 'logger', version: '' });
        } finally {
            process.chdir(cwd);
        }
    });
});

describe('helpers/transportsConfig()', () => {
    afterEach(() => {
        delete process.env.LOGGER_TRANSPORTS;
    });

    it('should return an empty list when nothing is configured', () => {
        assert.deepEqual(transportsConfig(), []);
    });

    it('should parse configured transports and substitute placeholders', () => {
        process.env.LOGGER_TRANSPORTS = JSON.stringify([
            {
                type: 'file',
                enabled: false,
                options: { filename: '%name-%version.log' },
            },
        ]);

        assert.deepEqual(transportsConfig(), [
            {
                type: 'file',
                enabled: false,
                options: { filename: `${self.name}-${self.version}.log` },
            },
        ]);
    });

    it('should throw a TypeError on malformed configuration', () => {
        process.env.LOGGER_TRANSPORTS = '{not-json';

        assert.throws(() => transportsConfig(), {
            name: 'TypeError',
            message: /can not parse transports config/,
        });
    });
});

describe('helpers/defaultMetadata()', () => {
    afterEach(() => {
        delete process.env.LOGGER_METADATA;
    });

    it('should return an empty object when nothing is configured', () => {
        assert.deepEqual(defaultMetadata(), {});
    });

    it('should parse configured metadata and substitute placeholders', () => {
        process.env.LOGGER_METADATA = '{"service":"%name","tag":"%version"}';

        assert.deepEqual(defaultMetadata(), {
            service: self.name,
            tag: self.version,
        });
    });

    it('should throw a TypeError on malformed metadata', () => {
        process.env.LOGGER_METADATA = '{not-json';

        assert.throws(() => defaultMetadata(), {
            name: 'TypeError',
            message: /can not parse metadata/,
        });
    });
});
