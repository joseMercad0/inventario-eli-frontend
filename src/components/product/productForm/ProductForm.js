import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./ProductForm.scss"
import Card from '../../card/Card';


const ProductForm = ({ product, productImage, imagePreview, description, setDescription, handleInputChange, handleImageChange, saveProduct, }) => {
  return (<div className='add-product'>
    <Card cardClass={"card"}>
      <form onSubmit={saveProduct}>
        <Card cardClass={"group"}>
          <label >Imagen Producto</label>
          <code className='--color-dark'>Formatos Aceptados: jpg, jpeg, png</code>
          <input type='file' name='image' onChange={(e) => handleImageChange(e)} />
          {imagePreview != null ? (
            <div className='image-preview'>
              <img src={imagePreview} alt='producto' />
            </div>
          ) : (<p>NO imagen del producto</p>
          )}
        </Card>
        <label>Nombre del Producto:</label>
        <input type='text' placeholder='Nombre del Producto' name='name' value={product?.name} onChange={handleInputChange} />
        <label>Categoria del Producto:</label>
        <input type='text' placeholder='Categoria del Producto' name='category' value={product?.category} onChange={handleInputChange} />
        <label>Precio del Producto:</label>
        <input type='text' placeholder='Precio del Producto' name='price' value={product?.price} onChange={handleInputChange} />
        <label>Cantidad del Producto:</label>
        <input type='text' placeholder='Cantidad del Producto' name='quantity' value={product?.quantity} onChange={handleInputChange} />
        <label>Descripcion del Producto:</label>
        <ReactQuill theme="snow" value={description} onChange={setDescription} modules={ProductForm.modules} formats={ProductForm.formats}/>
        <div className='--my'>
          <button type='submit' className='--btn --btn-primary'>
            Guardar Producto
          </button>
        </div>
      </form>
    </Card>
  </div>
  )
};
ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm