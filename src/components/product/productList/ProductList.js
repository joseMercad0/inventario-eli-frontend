import React, { useEffect, useState } from 'react'
import "./productList.scss";
import { SpinnerImg } from "../../loader/Loader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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

  const dispatch = useDispatch()

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
    <div className='product-list'>
      <hr />
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Items del Inventario</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading && <SpinnerImg />}
        <div className='table'>
          {!isLoading && products.length === 0 ? (
            <p>--No producto encontrado por favor agrege un producto..</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Valor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>{"s/"}{price}</td>
                      <td>
                        <button
                          onClick={() =>
                            setEditedQuantities((prev) => ({
                              ...prev,
                              [_id]: Math.max(Number(prev[_id] ?? quantity) - 1, 0),
                            }))
                          }
                        >
                          -
                        </button>
                        {editedQuantities[_id] !== undefined ? editedQuantities[_id] : quantity}
                        <button
                          onClick={() =>
                            setEditedQuantities((prev) => ({
                              ...prev,
                              [_id]: Number(prev[_id] ?? quantity) + 1,
                            }))
                          }
                        >
                          +
                        </button>
                        {editedQuantities[_id] !== undefined &&
                          editedQuantities[_id] !== quantity && (
                            <button
                              className="guardar-btn"
                              onClick={() => {
                                dispatch(
                                  updateProduct({
                                    id: _id,
                                    formData: { quantity: editedQuantities[_id] },
                                  })
                                ).then(() => {
                                  dispatch(getProducts());
                                  setEditedQuantities((prev) => {
                                    const copy = { ...prev };
                                    delete copy[_id];
                                    return copy;
                                  });
                                });
                              }}
                            >
                              Guardar
                            </button>
                          )}
                      </td>


                      <td>{"s/"}{price * quantity}</td>
                      <td className='icons'>
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>

                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt size={25} color={"red"} onClick={() => confirmDelete(_id)} />
                        </span>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Siguiente"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="Anterior"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />

      </div>
    </div>
  )
}

export default ProductList;