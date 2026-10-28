
require('dotenv').config();

const sql = require('mssql/msnodesqlv8');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: 'ODBC Driver 18 for SQL Server',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server correctamente.');
    return pool;
  })
  .catch(error => {
    console.error('Error al conectar con SQL Server:', error.message);
    throw error;
  });

module.exports = { sql, poolPromise };
