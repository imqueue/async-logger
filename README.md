# @imqueue/async-logger

Configurable async logger over winston for @imqueue services.

## Install

~~~bash
npm i --save @imqueue/async-logger
~~~

## Usage

There are two actual ways of using async logger.

1. Rely on singleton instance produced by this library, which is configured by
   environment variables (see Configuration section below)
   
   In this case as simple as
   ~~~typescript
   import logger from '@imqueue/async-async-logger';
   
   serviceOptions.logger = logger;
   ~~~

2. Instantiate and configure async logger programmatically:
   ~~~typescript
   import { Logger } from '@imqueue/async-async-logger';
   
   const { name, version } = require('./package.json');
   
   const logger = new Logger({
       transports: [{
           type: 'http',
           options: {
               ssl: true,
               port: 443,
               path: '/v1/input/<YOUR_API_KEY>',
               host: 'http-intake.logs.datadoghq.com',
               headers: {
                   'Content-Type': 'application/json',
               },
           },
           enabled: true,
       }],
       metadata: {
           ddsource: `${ name } ${ version }`,
           ddtags: 'env: dev',
           hostname: 'localhost'
       },
   });
   
   serviceOptions.logger = logger;
   ~~~

## Configuration

Logger can be configured via environment variables. It can be easily integrated
with any remote services. Here we will example configuration based on assumption
to connect with Datadog remote service.

So, basically there are two basic configuration options available:

~~~bash
export LOGGER_TRANSPORTS='[]'
export LOGGER_METADATA='{}'
~~~

Both of them are simply JSON strings referring to replicate corresponding
winston logger settings. Both of them can accept string tags `%name`, `%version`
for dynamic setting of these values from a current service package, if needed.

1. To configure HTTP transport follow to pass such object to `LOGGER_TRANSPORTS`
array:

~~~json
{
    "type": string,
    "options": {
        "ssl": boolean,
        "port": number,
        "path": string,
        "host": string,
        "headers": object
    },
    "enabled": boolean
}
~~~

2. To configure File transport

~~~json
{
    "type": string,
    "options": {
        "filename": string,
        "dirname": string,
        "options": object,
        "maxsize": number,
        "zippedArchive": boolean,
        "maxFiles": number,
        "eol": string,
        "tailable": boolean
    },
    "enabled": boolean
}
~~~

EXAMPLE FOR DATADOG:

~~~bash
export LOGGER_TRANSPORTS='[{"type":"http","options":{"ssl":true,"port":443,"path":"/v1/input/[DATADOG_API_KEY]","host":"http-intake.logs.datadoghq.com","headers":{"Content-Type":"application/json"}}, "enabled": true }]'
~~~

where DATADOG_API_KEY should be replaced with an actual API key.

3. To configure metadata consider the following `LOGGER_METADATA` object:

~~~json
{
    "ddsource": string,
    "ddtags": string,
    "hostname": string
}
~~~

EXAMPLE FOR DATADOG:

~~~bash
export LOGGER_METADATA='{"ddsource":"%name %version","ddtags":"env: dev","hostname":"localhost"}'
~~~

### Lets See It Human-Readable:

~~~bash
# example of transports config
export LOGGER_TRANSPORTS='[{
    "type": "http",
    "options": {
        "ssl": true,
        "port": 443,
        "path": "/v1/input/<YOUR_API_KEY>",
        "host": "http-intake.logs.datadoghq.com",
        "headers": {
            "Content-Type": "application/json"
        }
    },
    "enabled": true
}, {
    "type": "file",
    "options": {
        "filename": "logs.log",
        "dirname": "/home/usr/logs",
        "options": object,
        "zippedArchive": false,
    }
    "enabled": true
}]'
# example of metadata for datadog
export LOGGER_METADATA='{
    "ddsource": "%name %version",
    "ddtags": "env: dev",
    "hostname": "localhost"
}';
~~~

## Contributing

Any contributions are greatly appreciated. Feel free to fork, propose PRs, open
issues, do whatever you think may be helpful to this project. PRs which passes
all tests and do not brake tslint rules are first-class candidates to be
accepted!

## License

[ISC](https://github.com/imqueue/pg-pubsub/blob/master/LICENSE)

Happy Coding!
