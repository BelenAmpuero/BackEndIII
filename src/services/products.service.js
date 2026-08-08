import productRepository from "../repositories/order.repository.js";

class ProductService {

    async getProducts() {

        const products = await productRepository.getAll();

        return products;
    }

}

export default new ProductService();