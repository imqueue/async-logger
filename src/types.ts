/*!
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

/**
 * Structural copies of the @imqueue/core types this package uses, kept
 * local so the logger carries no runtime dependency on the queue library.
 * The shapes match @imqueue/core exactly, so values typed here remain
 * assignment-compatible with code written against the core interfaces.
 */

/**
 * Represents any JSON-serializable value
 */
export type AnyJson =
    | boolean
    | number
    | string
    | null
    | undefined
    | JsonArray
    | JsonObject;

/**
 * Represents JSON serializable object
 */
export interface JsonObject {
    [key: string]: AnyJson;
}

/**
 * Represents JSON-serializable array
 */
export interface JsonArray extends Array<AnyJson> {}

/**
 * Logger interface
 */
export interface ILogger {
    /**
     * Log level function
     *
     * @param {...unknown[]} args
     */
    log(...args: unknown[]): void;

    /**
     * Info level function
     *
     * @param {...unknown[]} args
     */
    info(...args: unknown[]): void;

    /**
     * Warning level function
     *
     * @param {...unknown[]} args
     */
    warn(...args: unknown[]): void;

    /**
     * Error level function
     *
     * @param {...unknown[]} args
     */
    error(...args: unknown[]): void;
}
