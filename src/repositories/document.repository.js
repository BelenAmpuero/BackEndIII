const Document = require("../models/document.model");

class DocumentRepository {

    async create(documentData) {
        return await Document.create(documentData);
    }

    async getById(id) {
        return await Document.findById(id);
    }

    async deleteById(id) {
        return await Document.findByIdAndDelete(id);
    }
}

module.exports = new DocumentRepository();