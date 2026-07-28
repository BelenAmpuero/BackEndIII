import productService from "../services/products.service.js";

export const getProducts = async (req,res)=>{

    const products = await productService.getProducts();

    res.json(products);

}