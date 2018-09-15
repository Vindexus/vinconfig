const config = require('../../vinconfig') //require('vinconfig')
const schema = {
  type: "object",
  required: ['numResponses', 'lang'],
  properties: {
    numResponses: {
      type: "integer"
    },
    lang: {
      type: "object",
      required: ['name', 'hello'],
      properties: {
        name: {
          type: "string",
        },
        hello: {
          type: "string"
        }
      }
    }
  }
}

module.exports = config(schema, {
  default: "english",
  directory: __dirname + '/config'
})