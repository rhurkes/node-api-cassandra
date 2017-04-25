-- Drop the keyspace if it exists
DROP KEYSPACE IF EXISTS node_api_cassandra;

-- Create our keyspace
CREATE KEYSPACE node_api_cassandra WITH replication =
  { 'class': 'SimpleStrategy', 'replication_factor': 1 };

-- Use the keyspace
USE node_api_cassandra;

-- Table: products
CREATE TABLE products (
  product_id int,
  price decimal,
  currency_code text,
  PRIMARY KEY(product_id)
);

-- Add some initial data
INSERT INTO products (product_id, price, currency_code) VALUES (16696652, 39.99, 'USD');
INSERT INTO products (product_id, price, currency_code) VALUES (13860428, 19.98, 'USD');
