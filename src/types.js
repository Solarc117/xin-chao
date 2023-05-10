/**
 * @typedef {object} Product A product in the shop's menu.
 * @property {string} name The name of the product. Must be between 1 and 30 characters long.
 * @property {string} [description] The description of the product. Must be no more than 120 characters long.
 * @property {('Coffee'|'Non-Coffee'|'Specialty Sodas'|'Milk Teas'|'Smoothies'|'Appetizers'|'Other')} category The category of the product.
 * @property {(string|Object.<string, string>)} price The price of the product. Must be a string or an object with string values that match the pattern /^\d+\.\d{2}$/.
 * @property {('hot'|'cold')[]} [temperature] The temperature options for the product.
 */

/**
 * @typedef {object} LambdaFunctionResponse The response object returned by an AWS Lambda function.
 * @property {number} statusCode The HTTP status code of the response.
 * @property {Object.<string, string>} [headers] The HTTP headers of the response.
 * @property {string} [body] The body of the response. Must be a string.
 * @property {boolean} [isBase64Encoded] Whether the body is Base64-encoded.
 */