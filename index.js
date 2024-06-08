const { Client } = require('pg');
const faker = require('faker');
require('dotenv').config();

const start = performance.now();

faker.locale = 'id_ID';

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

function generateStatus() {
  // Set the probability of 'Aktif' as 75%
  const activeProbability = 0.75;

  // Generate a random number between 0 and 1
  const randomNumber = Math.random();
 

  // Check if the random number is less than or equal to the probability
  if (randomNumber <= activeProbability) {
    return 'Aktif';
  } else {
    return 'Tidak AKtif';
  }
}

function generateRandomDoB(minAge = 18, maxAge = 70) {
  // Set today's date
  const today = new Date();

  // Calculate milliseconds in a year
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;

  // Calculate minimum and maximum milliseconds based on age range
  const minMilliseconds = today.getTime() - (millisecondsPerYear * maxAge);
  const maxMilliseconds = today.getTime() - (millisecondsPerYear * minAge);

  // Generate random milliseconds within the range
  const randomMilliseconds = Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) + minMilliseconds;

  // Convert milliseconds to date object
  const dob = new Date(randomMilliseconds);

  // Ensure date is valid (e.g., not February 30th)
  dob.setDate(dob.getDate() + Math.random() * 2); // Adjust date by up to 2 days

  return dob.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

const generateMockData = async (n) => {
  // const insertQuery = 'INSERT INTO dokter (nama_dokter, telepon_dokter, alamat_dokter, tanggal_lahir_dokter, gaji, status_dokter) VALUES ($1, $2, $3, $4, $5, $6)';
  // const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  //   const email = faker.internet.email();
  //   const age = faker.datatype.number({ min: 20, max: 60 });
  // nama = 'Dr. Budi Santoso'
  // telepon = '082211225656'
  // alamat = 'Jln. Gajah Mada no. 34'
  // tanngal_lahir = '1995-10-21'
  // gaji = 13500000
  // status_dokter = 'Tidak Aktif'  

    
  let i = 0
  for (i = 0; i < n; i++) {
    console.log(`${i}/${n}`)
    // const nama = `dr. ${faker.name.firstName()} ${faker.name.lastName()}`;
    const nama = `dr. ${faker.name.findName()}`;
    const alamat = `${faker.address.streetAddress()}`
    const tanggal_lahir = generateRandomDoB()
    const telepon = `${faker.phone.phoneNumber()}`;
    const gaji = faker.datatype.number({ min: 8000000, max: 15000000 });
    const status_dokter = generateStatus()

    const insertQuery = 'INSERT INTO dokter (nama_dokter, telepon_dokter, alamat_dokter, tanggal_lahir_dokter, gaji, status_dokter) VALUES ($1, $2, $3, $4, $5, $6)';
    
    try {
      await client.query(insertQuery, [nama, telepon, alamat, tanggal_lahir, gaji, status_dokter]);
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  
  
  }

  
  
  console.log(`${i} mock data rows inserted.`);
  const end = performance.now();

  const executionTime = end - start;

  console.log(`Execution time: ${executionTime} milliseconds`);

  
  return 0;
};

// generateMockData()

generateMockData(10000)


// Execute the function to select data
