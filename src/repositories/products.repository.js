import ProductModel from "../models/product.model.js";

class ProductRepository {

    async getAll() {
        return await ProductModel.find();
    }

    async getById(id) {
        return await ProductModel.findById(id);
    }

}

export default new ProductRepository();