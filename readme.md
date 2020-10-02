# Vinconfig

A simple NodeJS library for loading in config files. Requires that the provided config files match the given schema. Validates config with [jsonschema](https://www.npmjs.com/package/jsonschema) npm package.

Created by [Colin "Vindexus" Kierans](https://colinkierans.com)

## Installation
`npm install Vindexus/vinconfig`

## Usage

### 1. Create a Config Loader File
Create a file called `config.js` that will export your config variables.

@`/path/to/your/project/lib/config.js`

```
const config = require('vinconfig')
const path = require('path')
const schema = {
  type: "object",
  required: ['port'],
  properties: {
    port: {
      type: "integer"
    }
  }
}

const options = {
  directory: path.resolve(__dirname, '..', 'config')
  //directory: '/path/to/your/project/config' //This would also work
}

module.exports = config(schema, options)

```

### 2. Create Config File(s)
Create the JSON or JS files that will hold your configuration.

@`/path/to/your/project/config/production.js`

```
module.exports = {
  "port": 4000
}
```

### 3. Require Config Loader
@`/path/to/your/project/server.js`

```
#server.js
const config = require('./lib/config')

console.log('Listening on port ' + config.port)
```

### 4. Specify Config at Run Time
You can specify which config to load with the ENV variable `CONFIG`. You can change which env variable name to use with the `envVar` option.

Vinconfig will attempt to load multiple file locations until it finds one that works. It attempts to load in this order:

 * `CONFIG` as a path directory to a file, extension included
 * `CONFIG` with `.json` as extension in defaultDirectory
 * `CONFIG` with `.js` as extension in defaultDirectory

#### Command Line Variables
You can also specify the config with `--config CONFIG_VALUE` or `-c CONFIG_VALUE`.

## Examples

### Hello World

[View Hello World example](./examples/helloworld).

Says a different message depending on the config file loaded.

#### Mac & Linux
`DEBUG=vinconfig node examples/helloworld/index.js`  
`CONFIG=french DEBUG=vinconfig node examples/helloworld/index.js`  
`CONFIG=/absolute/path/to/exmaples/helloworld/config/dynamic.js DEBUG=vinconfig node examples/helloworld/index.js`  

#### Windows
`set DEBUG=vinconfig && node examples/helloworld/index.js`  
`set CONFIG=french && set DEBUG=vinconfig && node examples/helloworld/index.js`  
`set CONFIG=/absolute/path/to/exmaples/helloworld/config/dynamic.js set DEBUG=vinconfig && node examples/helloworld/index.js`  

## Vinconfig parameters
### 1. Schema
First parameter is a JSON schema that validates the loaded config.

### 2. Options
key:value of options

|key|purpose|default|
|:--|:--|:--|
|`directory`|Tells vinconfig where to look for config files if an absolute filepath is not provided.|`process.cwd() + '/config'`|
|`defaultConfig`|Default config to try to load.|`development`
|`envVar`|Which process.env. variable to read.|`CONFIG`

## Debug
Set env variable `DEBUG` to match `vinconfig` to debug things with the `debug` repo.
