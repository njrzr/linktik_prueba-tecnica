"use client";

import { useEffect, useState } from "react";
import { dashboard } from "../actions";
import Link from "next/link";

export default function Dahsboard() {
  const [ gotData, setGotData ] = useState(false);
  const [ totalSales, setTotalSales ] = useState<number>(0);
  const [ topProducts, setTopProducts ] = useState<object>({});
  const [ topClients, setTopClients ] = useState<object>({});
  const [ lowStock, setLowStock ] = useState<object>({});

  const scrollbarNone: object = {
    scrollbarWidth: 'none',
  }

  const getDashboard = async(): Promise<void> => {
    const data = await dashboard();
    setTotalSales(data.total_sales);
    setTopProducts(JSON.parse(data.top_products));
    setTopClients(JSON.parse(data.top_clients));
    setLowStock(JSON.parse(data.low_stock));
    setGotData(true);
  }

  const formatPrice = (number: number): string => {
    return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(number)
  }

  useEffect(() => {
    (async () => getDashboard())();
  }, []);

  return (
     <div className="relative w-full h-screen bg-white p-1 flex flex-col gap-1">
      <header className="relative flex flex-col sm:flex-row justify-between items-center p-4 text-white font-mono bg-green-900 rounded-lg">
        <p className="relative text-lg sm:text-2xl font-semibold">Dashboard</p>
        <div
          className="relative flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex justify-center items-center gap-4 w-auto h-auto rounded-lg">
            <Link className="relative text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/shop">/SHOP</Link>
            <Link className="relative text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/admin">/ADMIN</Link>
            <Link className="relative text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/dashboard">/DASHBOARD</Link>
          </div>

          <p className="relative text-lg sm:text-2xl font-semibold">LINKTIC | Prueba tecnica</p>
        </div>
      </header>

      <div
        className="relative grid sm:grid-cols-12 gap-1 pb-20 overflow-clip overflow-y-scroll" style={scrollbarNone}>
        { !gotData ? (
            <p className="relative col-span-12 text-xl text-center bg-green-400 text-white font-bold uppercase py-6 rounded-lg animate-pulse">
              cargando dashboard
            </p>
          ) : (
            <div
              className="relative col-span-12 grid grid-cols-12 gap-2">
              <div
                className="relative col-span-12 flex justify-between items-center p-4 rounded-lg bg-green-300">
                <p className="text-black font-semibold text-xl">Ventas totales</p>
                <p className="text-black">{ formatPrice(totalSales) }</p>
              </div>

              <div
                className="relative col-span-12 flex flex-col justify-between p-4 rounded-lg bg-green-300">
                <p className="text-black font-semibold text-xl mb-2">Top 5 productos mas vendidos</p>
                <div
                  className="relative flex justify-between mb-2">
                  <p className="text-black font-semibold">Producto</p>
                  <p className="text-black font-semibold">Vendidos</p>
                </div>
                { Object.values(topProducts).map((item, index) => {
                    return(
                      <div
                        className="relative flex justify-between"
                        key={'top_product-' + index}>
                        <p className="text-black">{ item.product }</p>
                        <p className="text-black">{ item.quantity }</p>
                      </div>
                    )
                  })
                }
              </div>

              <div
                className="relative col-span-12 flex flex-col justify-between p-4 rounded-lg bg-green-300">
                <p className="text-black font-semibold text-xl mb-2">Top clientes mas activos</p>
                <div
                  className="relative flex justify-between mb-2">
                  <p className="text-black font-semibold">Cliente</p>
                  <p className="text-black font-semibold">Compras hechas</p>
                </div>
                { Object.values(topClients).map((item, index) => {
                    return(
                      <div
                        className="relative flex justify-between"
                        key={'top_client-' + index}>
                        <p className="text-black">{ item.client }</p>
                        <p className="text-black">{ item.purchases }</p>
                      </div>
                    )
                  })
                }
              </div>

              <div
                className="relative col-span-12 flex flex-col justify-between p-4 rounded-lg bg-green-300">
                <p className="text-black font-semibold text-xl mb-2">Productos proximo a agotarse</p>
                <div
                  className="relative flex justify-between mb-2">
                  <p className="text-black font-semibold">Producto</p>
                  <p className="text-black font-semibold">Inventario</p>
                </div>
                { Object.values(lowStock).map((item, index) => {
                    return(
                      <div
                        className="relative flex justify-between"
                        key={'low_stock-' + index}>
                        <p className="text-black">{ item.product }</p>
                        <p className="text-black">{ item.stock }</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}