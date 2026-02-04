"use server";

// import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_SUPABASE_URL
const key = process.env.NEXT_SUPABASE_KEY

// const DB_CONN = {
//   user: "",
//   database: "",
//   password: ""
// }

// const postgresTest = () => {
//   const pool = new Pool(DB_CONN);
//   const res = await pool.query("SELECT * FROM coffee_products");
//   return JSON.parse(JSON.stringify(res.rows));
// }

const createProductItem = async(product: FormData): Promise<string> => {
  const supabase = createClient(url, key);

  const file = product.get('image');
  let imageUrl = '';

  if(file || file.size !== 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;
    
    const { error: storageError } = await supabase.storage
      .from('coffee_storage')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage
      .from('coffee_storage')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  const { error } = await supabase
    .from('coffee_products')
    .insert({
      product: product.get('product'),
      price: product.get('price'),
      stock: product.get('stock'),
      image: imageUrl
    });

  if (error) {
    console.error(error);
    return 'No se pudo guardar producto.';
  }

  return 'Producto creado.';
}

const updateProductItem = async(product: FormData): Promise<string> => {
  const supabase = createClient(url, key);

  const file = product.get('image');

  if(file && file.size !== 0) {
    const { data } = await supabase
      .from('coffee_products')
      .select('*')
      .eq('id', product.get('id'));

    const filepath = data[0].image.split('coffee_storage/');

    await supabase.storage
      .from('coffee_storage')
      .remove([filepath[1]]);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;
    
    const { error: storageError } = await supabase.storage
      .from('coffee_storage')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage
      .from('coffee_storage')
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from('coffee_products')
      .update({
        image: publicUrl
      })
      .eq('id', product.get('id'))
      .select();
    
    if (error) {
      console.error(error);
      return 'No se pudo guardar la imagen.';
    }
  }

  const { error } = await supabase
    .from('coffee_products')
    .update({
      product: product.get('product'),
      price: product.get('price'),
      stock: product.get('stock')
    })
    .eq('id', product.get('id'))
    .select();

  if (error) {
    console.error(error);
    return 'No se pudo actualizar el producto.';
  }

  return 'Producto actualizado.';
}

const deleteProductItem = async(id: number): Promise<string> => {
  const supabase = createClient(url, key)

  const { error } = await supabase
    .from('coffee_products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return 'Producto no existe.';
  }

  return 'Producto eliminado.';
}

const getProducts = async(): Promise<object> => {
  const supabase = createClient(url, key)

  const { data, error } = await supabase
    .from('coffee_products')
    .select('*');

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

const proccessPurchase = async(data: FormData): Promise<string> => {
  const supabase = createClient(url, key);

  const { data: dataClientQuery } = await supabase
      .from('coffee_clients')
      .select('*')
      .eq('email', data.get('email'));

  let client = dataClientQuery;

  if(dataClientQuery.length == 0) {
    const { data: dataClientNew, error: errorClient } = await supabase
      .from('coffee_clients')
      .insert({
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        email: data.get('email')
      });

    if (errorClient) {
      console.error(errorClient);
      return 'No se pudo guardar el cliente.';
    }

    client = dataClientNew;
  }

  const items = JSON.parse(data.get('items'));

  for(const el of items) {
    const total = Number(el.qt) * Number(el.price);
    const newStock = Number(el.stock) - Number(el.qt);

    const { error: errorSale } = await supabase
      .from('coffee_sales')
      .insert({
        client_id: client[0].id,
        product_id: el.id,
        quantity: el.qt,
        total: total
      });

    const {error: errorProduct } = await supabase
      .from('coffee_products')
      .update({stock: newStock})
      .eq('id', el.id)
      .select();

    if (errorSale) {
      console.error(errorSale);
      return 'No se pudo guardar la compra.';
    }

    if (errorProduct) {
      console.error(errorProduct);
      return 'No se pudo actualizar el stock.';
    }
  };

  return 'Compra realizada.';
}

const dashboard = async(): Promise<object> => {
  let totalSale = 0;
  const lowStock = [];
  const topProducts = [];
  const topClients = [];

  const supabase = createClient(url, key)

  const { data: saleData, error: saleError } = await supabase
    .from('coffee_sales')
    .select(`
      *,
      coffee_products (
        product
      ),
      coffee_clients (
        first_name,
        last_name
      )
    `);

  const { data: productData, error: productError } = await supabase
    .from('coffee_products')
    .select('*');

  for (const sale of saleData) {
    totalSale += sale.total;

    if(topProducts[`'${sale.product_id}'`] !== undefined) {
      topProducts[`'${sale.product_id}'`].quantity += sale.quantity;
    } else {
      topProducts[`'${sale.product_id}'`] = {
        product: sale.coffee_products.product,
        quantity: sale.quantity
      };
    };

    if(topClients[`'${sale.client_id}'`] !== undefined) {
      topClients[`'${sale.client_id}'`].purchases += 1;
    } else {
      topClients[`'${sale.client_id}'`] = {
        client: sale.coffee_clients.first_name + ' ' + sale.coffee_clients.last_name,
        purchases: 1
      };
    };
  };

  const toValueTopProducts = Object.values(topProducts);
  const sortedTopProducts = toValueTopProducts.sort((a, b) => {
    return b.quantity - a.quantity;
  });

  const topFiveProducts = sortedTopProducts.slice(0, 5);

  const toValueTopClients = Object.values(topClients);
  const sortedTopClients = toValueTopClients.sort((a, b) => {
    return b.quantity - a.quantity;
  });

  const topFiveClients = sortedTopClients.slice(0, 5);

  for (const product of productData) {
    if(product.stock <= 5) lowStock.push({
      id: product.id,
      product: product.product,
      stock: product.stock
    });
  }

  if (saleError) {
    console.error(saleError);
    return { error: saleError };
  }

  if (productError) {
    console.error(productError);
    return { error: productError };
  }

  const data = {
    'total_sales': totalSale,
    'low_stock': JSON.stringify(lowStock),
    'top_products': JSON.stringify(topFiveProducts),
    'top_clients': JSON.stringify(topFiveClients)
  };
  
  return data;
}

export {
  createProductItem,
  updateProductItem,
  deleteProductItem,
  getProducts,
  proccessPurchase,
  dashboard
}