const { Client } = require('pg');
const faker = require('faker');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 30000, // 30 seconds timeout
    ssl: {
        rejectUnauthorized: false // Set to true to enforce SSL certificate validation
    }
  });
  
  // Connect to the database
  client.connect()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });


  const selectFromDoctor = async () => {
    const selectQuery = 'SELECT * FROM dokter';
  
    try {
      const res = await client.query(selectQuery);
      console.log('Data from doctor table:', res.rows);
    } catch (err) {
      console.error('Error executing query', err.stack);
    } finally {
      // Close the database connection
      await client.end();
    }
  };

  const generateMockData = async () => {
    const insertQuery = 'INSERT INTO dokter (id_dokter, username_dokter, password_dokter, nama_dokter, telepon_dokter, alamat_dokter, tanggal_lahir_dokter, gaji, status_dokter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    // const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    //   const email = faker.internet.email();
    //   const age = faker.datatype.number({ min: 20, max: 60 });
    id = 5
    username = 'Ernest2222'
    password = 'ErnestTrueMansWorld'
    nama = 'Ernest Prakoso'
    telepon = '081122111122'
    alamat = 'Jln. Pahlawan no. 44'
    tanngal_lahir = '1997-09-25'
    gaji = 12250000
    status_dokter = 'Aktif'  

      try {
        await client.query(insertQuery, [id, username, password, nama, telepon, alamat, tanngal_lahir, gaji, status_dokter]);
      } catch (err) {
        console.error('Error inserting data:', err);
      }

    // for (let i = 0; i < 100; i++) {
    //   const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    //   const email = faker.internet.email();
    //   const age = faker.datatype.number({ min: 20, max: 60 });
      
    //   try {
    //     await client.query(insertQuery, [name, email, age]);
    //   } catch (err) {
    //     console.error('Error inserting data:', err);
    //   }
    // }
    
    console.log('100 mock data rows inserted.');
  };

  generateMockData()
  
  // Execute the function to select data
 