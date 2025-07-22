import React, { useEffect, useState } from 'react'
import "./productList.scss";
import { SpinnerImg } from "../../loader/Loader";
import { FaEdit, FaTrashAlt, FaSave } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from '../../search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice';
import { Link } from 'react-router-dom';
import { updateProduct } from '../../../redux/features/product/productSlice';



const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [pendingQuantity, setPendingQuantity] = useState({});

  const dispatch = useDispatch()

  // Suma visual local (pero solo cambia visualmente)
  const handlePlusClick = (productId) => {
    setPendingQuantity(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  // Guardar: ahora sí actualiza el stock real
  const handleSaveClick = (productId, currentQuantity) => {
    const cantidadExtra = pendingQuantity[productId] || 0;
    if (cantidadExtra > 0) {
      handleStockChange(productId, currentQuantity + cantidadExtra);
      setPendingQuantity(prev => ({ ...prev, [productId]: 0 })); // Reset visual
    }
  };

  // Llama así al hacer click en los botones + y -
  const handleStockChange = (id, newQuantity) => {
    dispatch(updateProduct({ id, formData: { quantity: newQuantity } }))
      .then(() => dispatch(getProducts())); // Opcional, refresca la lista después de actualizar
  };

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shotenedText = text.substring(0, n).concat("...")
      return shotenedText
    }
    return text;
  };

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Borrar Producto',
      message: 'Esta seguro de borrarlo??',
      buttons: [
        {
          label: 'Borrar',
          onClick: () => delProduct(id)
        },
        {
          label: 'Cancelar',
          // onClick: () => alert('Click No')
        }
      ]
    });
  }

  //inicio pagina
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5



  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts])


  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset)
  };

  //fin paginando

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }))
  }, [products, search, dispatch]);


  return (
    <div className="product-list-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const sumaPendiente = pendingQuantity[product._id] || 0;
            return (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>s/{product.price}</td>
                <td>
                  {Number(product.quantity) + Number(sumaPendiente)}
                  <button
                    className="stock-btn"
                    onClick={() => handlePlusClick(product._id)}
                    title="Sumar al stock"
                    style={{ marginLeft: "10px" }}
                  >+</button>
                  {sumaPendiente > 0 && (
                    <button
                      className="save-btn"
                      onClick={() => handleSaveClick(product._id, Number(product.quantity))}
                      style={{ marginLeft: "5px" }}
                      title="Guardar"
                    >
                      <FaSave color="royalblue" />
                    </button>
                  )}
                </td>
                <td className='icons'>
                  <span>
                    <Link to={`/edit-product/${product._id}`}>
                      <FaEdit size={20} color={"green"} />
                    </Link>
                  </span>
                  <span>
                    <FaTrashAlt size={25} color={"red"} onClick={() => confirmDelete(product._id)} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};



export default ProductList;