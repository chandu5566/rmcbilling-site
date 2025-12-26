/**
 * Cube Test Lambda Functions (QC Module)
 */
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('cube_tests');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;
