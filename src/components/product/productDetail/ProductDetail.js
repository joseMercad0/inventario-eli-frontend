import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProduct } from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ProductDetail.scss";
import DOMPurify from "dompurify";


const ProductDetail = () => {
    useRedirectLoggedOutUser("/login");
    const dispatch = useDispatch();

    const { id } = useParams();

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const { product, isLoading, isError, message } = useSelector((state) => state.product);

    const stockStatus = (quantity) => {
        if (quantity > 0) {
            return <span className='--color-success'>En Stock</span>;
        }
        return <span className='--color-danger'> Fuera de Stock</span>;
    };

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getProduct(id));

        }

        if (isError) {
            console.log(message);
        }
    }, [isLoggedIn, isError, message, dispatch]);
    
    return (
        <div className='product-detail'>
            <h3 className='--mt'>Detalles del Producto</h3>
            <Card cardClass="card">
                {isLoading && <SpinnerImg />}
                {product && (
                    <div className="detail">
                        <Card cardClass="group">
                            {product?.image ? (
                                <img src={product.image.filePath} alt={product.image.fileName} />
                            ) : (
                                <p> No hay imagen puesta en este producto</p>
                            )}
                        </Card>


                        <h4>Producto Disponible: {stockStatus(product.quantity)}</h4>
                        <hr />
                        <h4>
                            <span className="badge">Nombre: </span> &nbsp; {product.name}
                        </h4>
                        <p>
                            <b>&rarr; SKU : </b> {product.sku}
                        </p>
                        <p>
                            <b>&rarr; Categoria : </b> {product.category}
                        </p>
                        <p>
                            <b>&rarr; Precio : </b> {"s/"} {product.price}
                        </p>
                        <p>
                            <b>&rarr; Cantidad en Stock : </b> {product.quantity}
                        </p>
                        <p>
                            <b>&rarr; Valor Total en Stock: </b> {"s/"} {product.price * product.quantity}
                        </p>
                        <hr />
                        <div dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(product.description)
                        }}></div>
                        <hr />
                        <code className="--color-dark">
                            Created on: {product.createdAt.toLocaleString("en-US")}
                        </code>
                        <br />
                        <code className="--color-dark">
                            Last Updated: {product.updatedAt.toLocaleString("en-US")}
                        </code>
                    </div>
                )}

            </Card>
        </div>
    )
}

export default ProductDetail