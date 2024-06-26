import axios from "axios"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/products/`

//Crear nuevo Producto
const createProduct = async (formData) => {
    const response = await axios.post(API_URL, formData)
    return response.data
};

//Tener todos los productos
const getProducts = async () => {
    const response = await axios.get(API_URL)
    return response.data
};

//Borrar Un producto
const deleteProduct = async (id) => {
    const response = await axios.delete(API_URL + id);
    return response.data;
};

//Ver Un producto
const getProduct = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
};

//actualizar un producto
const updateProduct = async (id, formData) => {
    const response = await axios.patch(`${API_URL}${id}`,formData);
    return response.data;
};


const productService = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
};

export default productService;