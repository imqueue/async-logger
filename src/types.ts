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
 * Any value that survives `JSON.stringify` unchanged.
 *
 * @remarks
 * A structural copy of the type in `@imqueue/core`, declared here so the logger
 * needs no runtime dependency on the queue library. The shapes match exactly, so
 * values remain assignable in both directions.
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
 * A JSON object — string keys, {@link AnyJson} values. This is the type of the
 * logger's default metadata.
 */
export interface JsonObject {
    [key: string]: AnyJson;
}

/** A JSON array — any number of {@link AnyJson} values. */
export interface JsonArray extends Array<AnyJson> {}

/**
 * The logger contract shared across `@imqueue` — the four console methods, and
 * nothing else.
 *
 * @remarks
 * Deliberately console-shaped, so `console` itself satisfies it and any
 * `@imqueue` component taking a logger accepts either that or a {@link Logger}
 * with no adapter. Implement it to route the framework's own output elsewhere.
 */
export interface ILogger {
    /** Logs at the default level. */
    log(...args: unknown[]): void;

    /** Logs at INFO level. */
    info(...args: unknown[]): void;

    /** Logs at WARN level. */
    warn(...args: unknown[]): void;

    /** Logs at ERROR level. */
    error(...args: unknown[]): void;
}
