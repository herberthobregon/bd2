CREATE KEYSPACE practica_bd2 WITH replication = { 'class': 'SimpleStrategy',
'replication_factor': '1' }
AND durable_writes = true;

CREATE TABLE clientes (
  id TEXT,
  name TEXT,
  last_name TEXT,
  email TEXT,
  genero TEXT,
  dir TEXT,
  iso_country TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE cuentas (
  cliente_id TEXT,
  entidad_id TEXT,
  id_cuenta BIGINT,
  tipo INT,
  nombre TEXT,
  PRIMARY KEY (cliente_id, entidad_id, id_cuenta, tipo)
) WITH CLUSTERING
ORDER BY
  (entidad_id ASC, id_cuenta ASC, tipo ASC);

CREATE TABLE entidad (
    id TEXT,
    name TEXT,
    dir TEXT,
    tipo SMALLINT,
    PRIMARY KEY (id)
);

CREATE TABLE saldo_cuenta (
    cliente_id TEXT,
    entidad_id TEXT,
    id_cuenta BIGINT,
    saldo counter,
    PRIMARY KEY (cliente_id, entidad_id, id_cuenta)
  ) WITH CLUSTERING
ORDER BY
  (entidad_id ASC, id_cuenta ASC);


-- export enum tipo {
-- Depositos = 0,
-- Retiros = 1,
-- Pagos = 2,
-- Cobros = 3,
-- Sueldos = 4
-- Error = 5
-- }
CREATE TABLE log_operaciones (
    cliente_id TEXT,
    entidad_id TEXT,
    id_cuenta INT,
    tipo INT,
    fecha INT,
    detalle TEXT,
    monto INT,
    tofrom_uid TEXT,
    tofrom_entidad_id TEXT,
    tofrom_id_cuenta INT,
    PRIMARY KEY (cliente_id, entidad_id, id_cuenta, tipo, fecha)
  ) WITH CLUSTERING
ORDER BY
  (
    entidad_id ASC,
    id_cuenta ASC,
    tipo ASC,
    fecha ASC
  );

CREATE MATERIALIZED VIEW log_operaciones_by_empresa AS
    SELECT *
    FROM log_operaciones
    WHERE entidad_id IS NOT NULL AND id_cuenta IS NOT NULL AND tipo is NOT NULL AND fecha IS NOT NULL
    PRIMARY KEY (entidad_id, tipo, cliente_id, id_cuenta, fecha);


COPY practica_bd2.clientes (id,name,last_name,email,genero)
FROM './csv/users.csv' WITH HEADER = TRUE;


COPY practica_bd2.cuentas(cliente_id,entidad_id,id_cuenta,tipo,nombre )
FROM './csv/cuentas.csv' WITH HEADER = TRUE;


COPY practica_bd2.entidad(id,name )
FROM './csv/entidad.csv' WITH HEADER = TRUE;

COPY practica_bd2.saldo_cuenta(cliente_id,entidad_id,id_cuenta,saldo)
FROM './csv/saldo_cuenta.csv' WITH HEADER = TRUE;

