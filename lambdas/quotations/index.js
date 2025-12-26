/**
 * Quotation Lambda Functions
 */
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('quotations');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;
