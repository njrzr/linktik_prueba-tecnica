-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.coffee_products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product character varying,
  price character varying,
  stock smallint,
  image json,
  CONSTRAINT coffee_products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.coffee_clients (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name character varying,
  last_name character varying,
  email character varying,
  CONSTRAINT coffee_clients_pkey PRIMARY KEY (id)
);

CREATE TABLE public.coffee_sales (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  client_id bigint,
  product_id bigint,
  quantity smallint,
  total smallint,
  CONSTRAINT coffee_sales_pkey PRIMARY KEY (id),
  CONSTRAINT coffee_sales_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.coffee_clients(id),
  CONSTRAINT coffee_sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.coffee_products(id)
);