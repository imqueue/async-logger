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
/**
 * Non-blocking logger for `@imqueue` services: writes to the console without
 * holding up the caller, and ships the same records to file or HTTP transports
 * configured entirely from the environment.
 *
 * The default export is a ready-to-use {@link Logger} already configured from
 * `LOGGER_TRANSPORTS` and `LOGGER_METADATA`, so the common case needs no
 * construction and no wiring:
 *
 * ```typescript
 * import logger from '@imqueue/async-logger';
 *
 * logger.info('service started on port %s', port);
 * ```
 *
 * @remarks
 * Console writes are deferred with `setTimeout`, which is what keeps a burst of
 * logging from blocking the event loop — and the reason for the package name.
 * Two consequences follow: log output can appear after code that ran later, and
 * a process that exits immediately after logging may lose the tail. Call it a
 * tick before exiting if the last lines matter.
 *
 * Transports are declared as JSON in `LOGGER_TRANSPORTS`. The placeholders
 * `%name` and `%version` are substituted from the running service's own
 * `package.json`, so one config can be shared across services:
 *
 * ```bash
 * export LOGGER_TRANSPORTS='[{"type":"http","options":{"ssl":true,"port":443,"host":"http-intake.logs.datadoghq.com","path":"/v1/input/<API_KEY>"},"enabled":true}]'
 * export LOGGER_METADATA='{"ddsource":"%name %version","ddtags":"env: dev"}'
 * ```
 *
 * With no transports configured the logger still works — console only. That is
 * the intended local-development mode, not a misconfiguration.
 *
 * @packageDocumentation
 */
import { Logger } from './src/index.js';

export * from './src/index.js';

/**
 * A {@link Logger} configured from the environment, constructed at import time.
 *
 * @remarks
 * Shared by every module that imports it, which is normally what you want — one
 * set of transports per process. Construct {@link Logger} directly instead when
 * you need different metadata or transports for a particular subsystem.
 *
 * Because it is built at import time, `LOGGER_TRANSPORTS` and `LOGGER_METADATA`
 * must already be set when this module is first imported; changing them later has
 * no effect on this instance.
 */
export default new Logger();
