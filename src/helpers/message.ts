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
import { format } from 'util';

/**
 * Renders `console.log`-style arguments into the single string a transport
 * record needs, applying `util.format` so `%s`/`%d`/`%j` placeholders and object
 * inspection behave exactly as they do on the console.
 *
 * @remarks
 * MUTATES the array it is given — the first element is shifted off to serve as
 * the format string. Pass a copy if you need the original afterwards.
 *
 * @param args - the logging arguments, first one treated as the format string
 * @returns the formatted message
 */
export function buildMessage(args: any[]): string {
    return format(args.shift(), ...args);
}
