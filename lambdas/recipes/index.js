/**
 * Recipe Lambda Functions (QC Module)
 */
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('recipes');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;
