/**
 * Delivery Challan Lambda Functions
 */
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('delivery_challans');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;
