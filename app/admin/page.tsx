"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { getProducts, createProductItem, deleteProductItem, updateProductItem } from "../actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelFreeIcons } from "@hugeicons/core-free-icons";

export default function Admin() {
  const [ productItems, setProduct ] = useState([]);
  const [ timeout, setTO ] = useState<ReturnType<typeof setTimeout>>();
  const [ message, setMessage ] = useState('');
  const [ edit, setEdit ] = useState(false);

  const [ form, setForm ] = useState({
    product: '',
    price: '',
    stock: '',
    image: ''
  });

  const [ formEdit, setFormEdit ] = useState({
    id: 0,
    product: '',
    price: '',
    stock: '',
    image: ''
  });

  const scrollbarNone: object = {
    scrollbarWidth: 'none',
  }

  const setValue = (event: Event, form: string): void => {
    const name = event.target.name;
    const value = name == 'image' ? event.target.files[0] : event.target.value;

    if(form == 'create') setForm(prev => ({ ...prev, [name]: value }));
    if(form == 'edit') setFormEdit(prev => ({ ...prev, [name]: value }));
  }

  const createProduct = async (event: Event): Promise<void> => {
    event.preventDefault();
    
    if(form.product.length == 0 || form.price.length == 0 || form.stock.length == 0 || form.image.length == 0) {
      return alert('Uno o mas campos se encuentran vacios.');
    }

    const formData = new FormData();
    formData.append('product', form.product);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('image', form.image);

    const res = await createProductItem(formData);
    setMessage(res);
    products();
    
    if(timeout != null) clearTimeout(timeout)

    setTO(setTimeout(() => {
      setMessage('');
    }, 2000));
  }

  const toggleEdit = (item: object, action: string = ''): void => {
    if (action == 'close') {
      setEdit(!edit);
      setFormEdit({
        id: 0,
        product: '',
        price: '',
        stock: '',
        image: ''
      });
      return;
    }

    setEdit(!edit);
    setFormEdit({
      id: item.id,
      product: item.product,
      price: item.price,
      stock: item.stock,
      image: ''
    });
  }

  const updateProduct = async (event: Event): Promise<void> => {
    event.preventDefault();
    
    if(formEdit.product.length == 0 || formEdit.price.length == 0 || formEdit.stock.length == 0) {
      return alert('Uno o mas campos se encuentran vacios.');
    }

    const formData = new FormData();

    formData.append('id', formEdit.id);
    formData.append('product', formEdit.product);
    formData.append('price', formEdit.price);
    formData.append('stock', formEdit.stock);
    formData.append('image', formEdit.image);

    const res = await updateProductItem(formData);
    setMessage(res);
    products();
    
    if(timeout != null) clearTimeout(timeout)

    setTO(setTimeout(() => {
      setMessage('');
    }, 2000));
  }

  const deleteProduct = async (event: Event, id: number): Promise<void> => {
    event.preventDefault();

    const answer = confirm('¿Esta seguro de eliminar producto?');
    if(!answer) return;

    const res = await deleteProductItem(id);
    setMessage(res);
    products();

    if(timeout != null) clearTimeout(timeout)

    setTO(setTimeout(() => {
      setMessage('');
    }, 2000));
  }

  const products = async (): Promise<void> => {
    const data = await getProducts();
    setProduct(data);
  }

  const formatPrice = (number: number): string => {
    return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(number)
  }

  useEffect(() => {
    products();
  }, []);

  return (
     <div className="relative w-full h-screen bg-white p-1 flex flex-col gap-1">
      <header className="relative flex justify-between p-4 text-white font-mono bg-green-900 rounded-lg">
        <p className="relative text-lg sm:text-2xl font-semibold">Admin / Administrar productos</p>
        <p className="relative text-lg sm:text-2xl font-semibold">LINKTIC | Prueba tecnica</p>
      </header>

      <div
        className="relative grid sm:grid-cols-12 gap-1 pb-20 overflow-clip overflow-y-scroll" style={scrollbarNone}>
        <form
          className="relative col-span-12 p-2 flex justify-between bg-green-500 rounded-lg overflow-clip"
          onSubmit={createProduct}>
          <div
            className="relative w-full flex justify-between gap-2 p-2 rounded-lg">
            <label
              className="relative flex gap-4 items-center p-1">
              Producto:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="text"
                placeholder="Café"
                value={form.product}
                onChange={(e) => setValue(e, 'create')}
                name="product" />
            </label>

            <label
              className="relative flex gap-4 items-center p-1">
              Precio:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="number"
                min={1000}
                placeholder="1000"
                value={form.price}
                onChange={(e) => setValue(e, 'create')}
                name="price" />
            </label>

            <label
              className="relative flex gap-4 items-center p-1">
              Stock:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="number" 
                min={1}
                placeholder="1"
                value={form.stock}
                onChange={(e) => setValue(e, 'create')}
                name="stock" />
            </label>

            <label
              className="relative flex gap-4 items-center p-1">
              Imagen:
              <input
                className="relative px-2 py-1 ring-2 ring-black rounded-lg bg-white text-black"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => setValue(e, 'create')}
                name="image" />
            </label>

            <button
              type="submit"
              className="relative w-60 bg-blue-500 hover:bg-blue-400 rounded-lg uppercase font-semibold py-2 transition-all duration-300 cursor-pointer">
                crear producto
            </button>
          </div>
        </form>

        <div
          className="relative w-auto h-auto col-span-12 space-y-2 overflow-clip overflow-y-scroll rounded-lg">
          { productItems.length == 0 ? (
            <p className="relative text-xl text-center bg-green-400 text-white font-bold uppercase py-6 rounded-lg animate-pulse">
              cargando
            </p>
          ) : (
            productItems.map((item, index) => {
              return(
                <div
                  key={'product-' + index}
                  className={`relative bg-green-400 p-4 flex items-center rounded-lg gap-4`}>
                    <div className="relative w-2/12 flex gap-2">
                      <button
                        onClick={() => toggleEdit(item)}
                        className="relative bg-blue-500 w-1/2 h-10 rounded-lg overflow-clip uppercase text-sm text-center font-semibold cursor-pointer"
                        >editar
                      </button>

                      <form
                        className="relative bg-red-500 w-1/2 h-10 rounded-lg overflow-clip"
                        onSubmit={(e) => deleteProduct(e, item.id)}>
                        <button
                          className="relative w-full h-full uppercase text-sm text-center font-semibold cursor-pointer"
                          >eliminar
                        </button>
                      </form>
                    </div>

                    <p className="relative w-6/12 text-white font-semibold">Producto: { item.product }</p>
                    <p className="relative w-3/12 text-white font-semibold">Precio: { formatPrice(item.price) }</p>
                    <p className="relative w-1/12 text-white font-semibold">Stock: { item.stock }</p>
                    <Image
                      width={'360'}
                      height={'360'}
                      className="relative w-12 h-12 object-contain bg-green-100 rounded shrink-0"
                      src={item.image}
                      alt="Imagen del producto."
                    />
                </div>
              )
            }
          ))}
        </div>
      </div>

      <div
        className={`fixed h-16 flex justify-center items-center bottom-2 sm:bottom-4 right-2 sm:right-4 bg-green-600 rounded-2xl overflow-clip shadow-sm shadow-rose-800 transition-all duration-300 z-20 ${ message.length > 0 ? 'max-w-full' : 'max-w-0' }`}>
        <p
          className="relative mx-12 uppercase text-xl font-medium whitespace-nowrap">
          { message }
        </p>
      </div>
      
      <div
        className={`fixed w-full h-screen flex justify-center items-start top-0 left-0 bg-green-600/75 shadow-sm shadow-rose-800 transition-all duration-300 whitespace-nowrap overflow-clip ${ edit ? 'max-h-full' : 'max-h-0' }`}>
        <button
          onClick={() => toggleEdit(0, 'close')}
          className="absolute top-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-400 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300">
          <HugeiconsIcon
            size={36}
            icon={CancelFreeIcons} />
        </button>

        <div
          className="relative w-auto h-auto mt-6 p-4 bg-white rounded-lg">
            <form
              onSubmit={updateProduct}>
              <div
                className="relative w-full flex flex-col gap-2 p-2 rounded-lg">
                <p className="relative text-center text-black font-medium text-xl mt-2 mb-6">Actualizar producto</p>
                <label
                  className="relative flex justify-between text-black gap-8 items-center p-1">
                  Producto:
                  <input
                    className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                    type="text"
                    placeholder="Café"
                    defaultValue={formEdit.product}
                    onChange={(e) => setValue(e, 'edit')}
                    name="product" />
                </label>

                <label
                  className="relative flex justify-between text-black gap-8 items-center p-1">
                  Precio:
                  <input
                    className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                    type="number"
                    min={1000}
                    placeholder="1000"
                    defaultValue={formEdit.price}
                    onChange={(e) => setValue(e, 'edit')}
                    name="price" />
                </label>

                <label
                  className="relative flex justify-between text-black gap-8 items-center p-1">
                  Stock:
                  <input
                    className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                    type="number" 
                    min={1}
                    placeholder="1"
                    defaultValue={formEdit.stock}
                    onChange={(e) => setValue(e, 'edit')}
                    name="stock" />
                </label>

                <label
                  className="relative flex justify-between text-black gap-8 items-center p-1">
                  Imagen:
                  <input
                    className="relative w-70 px-2 py-1 ring-2 ring-black rounded-lg bg-white text-black"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => setValue(e, 'edit')}
                    name="image" />
                </label>

                <button
                  type="submit"
                  className="relative w-full h-auto mt-4 bg-blue-500 hover:bg-blue-400 rounded-lg uppercase font-semibold py-2 transition-all duration-300 cursor-pointer">
                    actualizar
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}