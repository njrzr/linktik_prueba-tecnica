"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon, Cancel01Icon, CoffeeBeansIcon } from "@hugeicons/core-free-icons";
import { getProducts, proccessPurchase } from "../actions";

import Image from "next/image";
import Link from "next/link";

export default function CoffeeShop() {
  const [ timeout, setTO ] = useState<ReturnType<typeof setTimeout>>();
  const [ coffeeCart, setCoffeeCart ] = useState([]);
  const [ toggleCart, setToggleCart ] = useState(false);
  const [ toggleForm, setToggleForm ] = useState(false);
  const [ added, setAdded ] = useState(false);
  const [ total, setTotal ] = useState(0);
  const [ items, setItems] = useState<object>([]) ;
  const [ message, setMessage ] = useState('');
  const [ form, setForm ] = useState({
    'first_name': '',
    'last_name': '',
    email: ''
  });

  const scrollbarNone: object = {
    scrollbarWidth: 'none',
  }

  const products = async(): Promise<void> => {
    const data = await getProducts();
    setItems(data);
  }

  const addProduct = (index: number, id: number): void => {
    const inCart = coffeeCart.filter(el => el.id == id);
    
    if (inCart.length > 0) {
      const changedArr = coffeeCart.map(el => {
        if(el.qt >= el.stock) {
          alert('No se puede agregar mas elementos del producto.');
        } else if(el.id == id) {
          el.qt += 1;
          setTotal((item) => (item + Number(el.price)));
        }

        return el;
      })

      setCoffeeCart(changedArr);
    } else {
      const copyItems = items[index];
      if(copyItems.stock == 0) return alert('No se puede agregar el producto.');
      copyItems.qt = 1;
      setTotal((el) => (el + Number(copyItems.price)));
      setCoffeeCart([...coffeeCart, copyItems]);
    }

    setAdded(true);

    if(timeout != null) clearTimeout(timeout);

    setTO(setTimeout(() => {
      setAdded(false);
    }, 2000));
  }

  const toggleCartAction = (): void => {
    if(toggleForm) setToggleForm(!toggleForm);
    if(coffeeCart.length == 0 || toggleForm == true) return;
    setToggleCart(!toggleCart);
  }

  const toggleClientForm = (): void => {
    setToggleCart(!toggleCart);
    setToggleForm(!toggleForm);
  }

  const makePurchase = async (event: Event): Promise<void> => {
    event.preventDefault();

    if(form.first_name.length == 0 || form.last_name.length == 0 || form.email.length == 0) {
      return alert('Uno o mas campos se encuentran vacios.');
    }

    const formData = new FormData();
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('email', form.email);
    formData.append('items', JSON.stringify(coffeeCart));

    const res = await proccessPurchase(formData);
    setMessage(res);
    setToggleForm(!toggleForm);
    setForm({
      'first_name': '',
      'last_name': '',
      email: ''
    });

    setCoffeeCart([]);
    setTotal(0);
    await products();
    
    if(timeout != null) clearTimeout(timeout)

    setTO(setTimeout(() => {
      setMessage('');
    }, 2000));
  }

  const setValue = (event: Event): void => {
    const name = event.target.name;
    const value = event.target.value;

    setForm(prev => ({ ...prev, [name]: value }));
  }

  const formatPrice = (number: number): string => {
    return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(number)
  }

  useEffect(() => {
    products();
  }, []);

  return(
    <div className="relative w-full h-screen bg-white p-1 flex flex-col gap-1">
      <header className="relative flex flex-col sm:flex-row justify-between items-center p-4 text-white font-mono bg-green-900 rounded-lg">
        <p className="relative text-lg sm:text-2xl font-semibold">Coffee Shop</p>
        
        <div
          className="relative flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex justify-center items-center gap-4 w-auto h-auto rounded-lg">
            <Link className="relative text-sm text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/shop">/SHOP</Link>
            <Link className="relative text-sm text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/admin">/ADMIN</Link>
            <Link className="relative text-sm text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/dashboard">/DASHBOARD</Link>
          </div>

          <p className="relative text-lg sm:text-2xl font-semibold">LINKTIC | Prueba tecnica</p>
        </div>
      </header>

      <div
        className="relative grid sm:grid-cols-12 gap-1 pb-20 overflow-clip overflow-y-scroll" style={scrollbarNone}>
        { items.length == 0 ? (
          <p className="relative col-span-12 text-xl text-center bg-green-400 text-white font-bold uppercase py-6 rounded-lg animate-pulse">
            cargando
          </p>
        ) : (
          items.map((item, index) => {
            return(
              <div
                className={`relative w-auto h-auto col-span-2 flex flex-col gap-2 p-2 rounded-lg inset-shadow-sm inset-shadow-rose-800 bg-teal-600`}
                key={'coffee-item-' + index}>
                <Image
                  width={'360'}
                  height={'360'}
                  className="relative w-full h-40 object-contain bg-green-100 rounded"
                  src={item.image}
                  alt="Imagen del producto."
                  loading="eager"
                />

                <div
                  className="relative w-full h-auto flex flex-col justify-between">
                  <p className="relative text-lg font-medium">{ item.product }</p>
                  <p className="relative text-lg font-medium flex justify-between place-self-end">
                    { item.stock <= 5 ? <span className="mr-8 font-bold">Pocas cantidades</span> : '' } { formatPrice(item.price) }
                  </p>
                  

                  {/* <div
                    className="relative flex justify-between items-center gap-4 mb-4">
                    <button
                      className="relative w-8 h-8 flex justify-center items-center bg-red-400 rounded cursor-pointer">
                      <HugeiconsIcon
                        size={20}
                        icon={MinusSignIcon} />
                    </button>

                    <span>
                      0
                    </span>

                    <button
                      className="relative w-8 h-8 flex justify-center items-center bg-blue-400 rounded cursor-pointer">
                      <HugeiconsIcon
                        size={20}
                        icon={PlusSignIcon} />
                    </button>
                  </div> */}

                  <button
                    onClick={() => addProduct(index, item.id)}
                    className="relative w-auto h-auto bg-green-600 px-6 py-2 font-semibold rounded shadow shadow-black cursor-pointer">
                    Agregar
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <button
        onClick={toggleCartAction}
        className={`fixed flex justify-center items-center bottom-2 sm:bottom-4 right-2 sm:right-4 w-16 h-16 bg-blue-500 rounded-2xl hover:bg-blue-500/75 transition-all duration-300 cursor-pointer ${ coffeeCart.length > 0 ? 'text-green-800' : '' }`}>
        <span
          className={`absolute w-6 h-6 -top-2 -left-2 bg-green-300 shadow-sm shadow-black rounded-full transition-all duration-300 ${ coffeeCart.length > 0 ? 'scale-100' : 'scale-0'} `}></span>
        <HugeiconsIcon
          size={32}
          icon={CoffeeBeansIcon} />
      </button>

      <div
        className={`fixed bg-white w-11/12 sm:w-4/12 bottom-22 right-4 rounded-lg inset-shadow-sm inset-shadow-pink-800 transition-all duration-300 overflow-clip ${toggleCart ? 'max-h-full' : 'max-h-0'}`}>
          <div className="relative w-full h-auto space-y-2 p-2">
            { coffeeCart.map((item, index) => {
              return(
                <div
                  className="relative flex justify-between items-center p-2"
                  key={'coffee-cart_' + index}>
                    <p
                      className="relative w-7/12 text-black">
                      { item.product }
                    </p>
                    
                    <p
                      className="relative w-3/12 text-black">
                      { formatPrice(item.price) }
                    </p>

                     <p
                      className="relative w-3/12 text-black">
                      Tazas: { item.qt }
                    </p>
                </div>
              )
            })}

            <p
              className="relative w-full h-auto text-lg text-right px-6 text-black font-bold">
                Total: { formatPrice(total) }
            </p>

            {/* <button
              onClick={() => toggleCartAction(false)}
              className="absolute flex justify-center items-center bottom-2 right-2 w-10 h-10 bg-red-500 rounded-lg hover:bg-red-500/75 transition-all duration-300 cursor-pointer">
              <HugeiconsIcon
                size={24}
                icon={Cancel01Icon} />
            </button> */}

            <button
              onClick={toggleClientForm}
              className="relative w-full h-10 uppercase font-semibold bg-blue-500 rounded-lg hover:bg-blue-500/75 transition-all duration-300 cursor-pointer">
              proceder a compra
            </button>
          </div>
      </div>

      <div
        className={`fixed bg-white w-11/12 sm:w-3/12 bottom-22 right-4 rounded-lg inset-shadow-sm inset-shadow-pink-800 transition-all duration-300 overflow-clip ${ toggleForm ? 'max-h-full' : 'max-h-0'}`}>
          <form
            onSubmit={makePurchase}
            className="relative space-y-2 p-2">
            <p className="relative text-black text-lg text-center mt-2 mb-4">Requerimos estos datos para procesar tu compra</p>
            <label
              className="relative flex gap-4 justify-between items-center p-1 text-black">
              Nombre:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="text"
                placeholder="John"
                value={form.first_name}
                onChange={setValue}
                name="first_name" />
            </label>

            <label
              className="relative flex gap-4 justify-between items-center p-1 text-black">
              Apellido:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="text"
                placeholder="Doe"
                value={form.last_name}
                onChange={setValue}
                name="last_name" />
            </label>

            <label
              className="relative flex gap-4 justify-between items-center p-1 text-black">
              Correo:
              <input
                className="relative px-2 py-1 ring-2 ring-black/25 rounded-lg bg-white text-black placeholder:text-black/50"
                type="email" 
                placeholder="johndoe@email.com"
                value={form.email}
                onChange={setValue}
                name="email" />
            </label>

            <button
              className="relative w-full h-10 uppercase font-semibold bg-blue-500 rounded-lg hover:bg-blue-500/75 transition-all duration-300 cursor-pointer">
              finalizar compra
            </button>
          </form>
      </div>

      <div
        className={`fixed h-16 flex justify-center items-center bottom-2 sm:bottom-4 right-20 sm:right-22 bg-green-600 rounded-2xl overflow-clip shadow-sm shadow-rose-800 transition-all duration-300 ${ added ? 'max-w-full' : 'max-w-0' }`}>
        <p
          className="relative mx-8 uppercase text-xl font-medium whitespace-nowrap">articulo agregado</p>
      </div>

      <div
        className={`fixed h-16 flex justify-center items-center bottom-2 sm:bottom-4 right-20 sm:right-22 bg-green-600 rounded-2xl overflow-clip shadow-sm shadow-rose-800 transition-all duration-300 z-20 ${ message ? 'max-w-full' : 'max-w-0' }`}>
        <p
          className="relative mx-12 uppercase text-xl font-medium whitespace-nowrap">
          { message }
        </p>
      </div>
    </div>
  );
}