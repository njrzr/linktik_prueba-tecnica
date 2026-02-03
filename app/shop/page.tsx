"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon, Cancel01Icon, CoffeeBeansIcon } from "@hugeicons/core-free-icons";

import Image from "next/image";

export default function CoffeeShop() {
  const [ timeout, setTO ] = useState<ReturnType<typeof setTimeout>>()
  const [ coffeeCart, setCoffeeCart ] = useState([])
  const [ toggleCart, setToggleCart ] = useState(false)
  const [ added, setAdded ] = useState(false)

  const scrollbarNone: object = {
    scrollbarWidth: 'none',
  }

  const items = [
    {
      id: 1,
      product: 'Coffee A',
      price: '10.000 $'
    },
    {
      id: 2,
      product: 'Coffee B',
      price: '12.000 $'
    },
    {
      id: 3,
      product: 'Coffee C',
      price: '8.000 $'
    },
    {
      id: 4,
      product: 'Coffee D',
      price: '6.000 $'
    }
  ]

  const addProduct = (index: number, id: number): void => {
    const inCart = coffeeCart.filter(el => el.id == id)
    
    if (inCart.length > 0) {
      const changedArr = coffeeCart.map(el => {
        if(el.id == id) el.qt += 1
        return el
      })

      setCoffeeCart(changedArr)
    } else {
      const copyItems = items[index]
      copyItems.qt = 1
      setCoffeeCart([...coffeeCart, copyItems])
    }

    setAdded(true)

    if(timeout != null) clearTimeout(timeout)

    setTO(setTimeout(() => {
      setAdded(false)
    }, 2000))
  }

  const toggleCartAction = (): void => {
    if (coffeeCart.length == 0) return
    setToggleCart(!toggleCart)
  }

  const makePurchase = (): void => {
    console.log('Compra hecha')
  }

  return(
    <div className="relative w-full h-screen bg-white p-1 flex flex-col gap-1">
      <header className="relative flex justify-between p-4 text-white font-mono bg-green-900 rounded-lg">
        <p className="relative text-lg sm:text-2xl font-semibold">Coffee Shop</p>
        <p className="relative text-lg sm:text-2xl font-semibold">LINKTIC | Prueba tecnica</p>
      </header>

      <div
        className="relative grid sm:grid-cols-12 gap-1 pb-20 overflow-clip overflow-y-scroll" style={scrollbarNone}>
        { items.map((item, index) => {
          return(
            <div
              className="relative w-auto h-auto col-span-2 flex flex-col gap-2 bg-teal-600 p-2 rounded-lg inset-shadow-sm inset-shadow-rose-800"
              key={'coffee-item-' + index}>
              <Image
                width={'360'}
                height={'360'}
                className="relative w-full h-36 object-contain bg-green-100 rounded"
                src={'/images/coffee-placeholder.png'}
                alt="Imagen del producto."
              />

              <div
                className="relative w-full h-auto flex flex-col justify-between">
                <p className="relative text-lg font-medium">{ item.product }</p>
                <p className="relative text-lg font-medium place-self-end">{ item.price }</p>

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
                  className="relative w-auto h-auto bg-green-600 px-6 py-1 font-semibold rounded shadow shadow-black cursor-pointer">
                  Agregar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={toggleCartAction}
        className={`fixed flex justify-center items-center bottom-2 sm:bottom-4 right-2 sm:right-4 w-16 h-16 bg-blue-500 rounded-2xl hover:bg-blue-500/75 transition-all duration-300 cursor-pointer ${ coffeeCart.length > 0 ? 'text-green-800' : '' }`}>
        <HugeiconsIcon
          size={32}
          icon={CoffeeBeansIcon} />
      </button>

      <div
        className={`fixed bg-white w-11/12 sm:w-4/12 bottom-22 right-4 rounded-lg inset-shadow-sm inset-shadow-pink-800 transition-all duration-300 overflow-clip ${toggleCart ? 'max-h-full' : 'max-h-0'}`}>
          <div className="relative w-full h-auto space-y-2 mb-12">
            { coffeeCart.map((item, index) => {
              return(
                <div
                  className="relative flex justify-between items-center px-4 first:pt-6 py-2"
                  key={'coffee-cart_' + index}>
                    <p
                      className="relative text-black">
                      { item.product }
                    </p>
                    
                    <p
                      className="relative text-black">
                      { item.price }
                    </p>

                     <p
                      className="relative text-black">
                      cups: { item.qt }
                    </p>
                </div>
              )
            })}
          </div>

          {/* <button
            onClick={() => toggleCartAction(false)}
            className="absolute flex justify-center items-center bottom-2 right-2 w-10 h-10 bg-red-500 rounded-lg hover:bg-red-500/75 transition-all duration-300 cursor-pointer">
            <HugeiconsIcon
              size={24}
              icon={Cancel01Icon} />
          </button> */}

          <button
            onClick={() => makePurchase()}
            className="absolute px-6 uppercase font-semibold bottom-2 left-2 w-auto h-10 bg-blue-500 rounded-lg hover:bg-blue-500/75 transition-all duration-300 cursor-pointer">
            comprar
          </button>
      </div>

      <div
        className={`fixed h-16 flex justify-center items-center bottom-2 sm:bottom-4 right-20 sm:right-22 bg-green-600 rounded-2xl overflow-clip shadow-sm shadow-rose-800 transition-all duration-300 ${ added ? 'max-w-full' : 'max-w-0' }`}>
        <p
          className="relative mx-12 uppercase text-xl font-medium whitespace-nowrap">articulo agregado</p>
      </div>
    </div>
  );
}