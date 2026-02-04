## Mis decisiones

Para comenzar decidi comenzar con la vista para visualizar la compra de productos a la cual llame shop, en este vista se visualizara los productos creados y permite la compra de los mismos a traves de un modal que se mostrara al presionar el boton de con el icono de granos de cafe, ahi se mostrara los productos agregados y al dar click a comprar mostrara otro modal donde el cliente debe ingresar los datos

Luego procedi a hacer la vista de admin para agregar productos ahi, se mostrara un formulario sencillo para agregar productos al sistema, en el mismo se visualiza los productos agregados, en las entradas estan las opciones para editar o eliminar el producto, lo cual facilita la visualizacionn y creacion de productos.

Por ultimo deje la vista dashboard para visualizar lo que pedia la prueba tecnica, ahi se visualiza el total de ventas los 5 productos mas vendidos, los 5 clientes que estan mas activos por comprar y productos prontos a agotarse

Comence usando postgresql para probar la conexion, pero como pedia la prueba decidi usar supabase (la cual no habia usado antes), me encanto la facilidad con la pude interactuar con la base de datos, sin complicaciones, me facilito por mucho la consulta e insercion de datos en la base de datos y para imagenes de los productos.

Respecto al servidor, pense en principio usar un servidor, pero decidi tomar la recomendacion de la prueba tecnica y use un actions global para generar la logica de servidor para obtener, crear, editar, eliminar y ordenar los datos para mostrar en sus respectivas vistas.

## Cosas que hay por mejorar

Por el ajustado tiempo que tuve, decidi darle importancia lo que era necesario por lo cual en mi lista de ajustes/mejoras estan:

- Agregar un login para la vista de administracion y dashboard, lei que supabase tiene un sistema para implementacion de login, por lo cual seria la primera opcion a usar para impementacion.
- Mejorar las vistas para ajustarla a formatos moviles (de ser requeridos) y asi facilitar su uso para este formato de vista.
- Desearia haber agregado la visualizacion de clientes para ver sus habitos de compra.
- Agregar un login para usuario para visualizacion de datos y compras hechas en la aplicacion.

## Modelacion de base de datos

Aqui fui un poco empirico, por asi decirlo, la creacion empezo con la tabla de productos para visualizar y agregar productos, luego de ello cree las tablas de cliente y ventas con sus respectivos relaciones a la tabla de productos y cliente desde la tabla de ventas. En el proyecto compartire la informacion de creacion de tablas para local.

## Creacion de base de datos

Sea en local o en supabase, lo primero es crear la tabla productos, despues creas la tabla de cliente y al final la de ventas la cual tiene que hacer enlace de relacion a las tablas clientes y productos.

## Que se necesita para la instalacion

Es necesario tener npm y node en su version 20 para realizar la instalacion del proyecto en local sin problema algunos, luego de esto configurar el .env con las variables necesarias en este caso: necesitas la url de la base de datos de supabase y la key para trabajar de forma local, ademas de establecer el protocolo (https) y el dominio de supabase (dominnio.supabase.co) para el correcto funcionamiento de almacenamiento y visualizacion de imagenes desde el bucket de supabase. Para terminar correr `npm run dev`, `pnpm dev` o `yarn dev` para ejecutar la aplicacion en local.