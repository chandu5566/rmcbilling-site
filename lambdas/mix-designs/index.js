/**
 * Mix Design Lambda Functions (QC Module)
 */
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('mix_designs');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;
