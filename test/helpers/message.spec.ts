/*!
 * buildMessage() Function Unit Tests
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
import { buildMessage } from '../..';

describe('helpers/buildMessage()', () => {
    it('should be a function', () => {
        assert.equal(typeof buildMessage, 'function');
    });

    it('should format the first argument with the rest (util.format)', () => {
        assert.equal(buildMessage(['Hello, %s!', 'World']), 'Hello, World!');
        assert.equal(buildMessage(['%d + %d', 1, 2]), '1 + 2');
    });

    it('should append extra arguments not consumed by placeholders', () => {
        assert.equal(buildMessage(['message', 'extra']), 'message extra');
    });

    it('should stringify non-string arguments', () => {
        assert.equal(buildMessage([{ a: 1 }]), '{ a: 1 }');
    });

    it('should not throw on an empty arguments list', () => {
        assert.equal(typeof buildMessage([]), 'string');
    });
});
