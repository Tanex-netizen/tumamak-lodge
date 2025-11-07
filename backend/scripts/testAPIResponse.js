import axios from 'axios';

const testAPI = async () => {
  try {
    // Test the rooms API endpoint
    const response = await axios.get('http://localhost:5000/api/rooms');
    
    console.log('=== API RESPONSE ===');
    console.log('Total rooms:', response.data.length);
    
    // Find Room 8
    const room8 = response.data.find(r => r.roomNumber === 'G08');
    
    if (room8) {
      console.log('\n=== ROOM 8 FROM API ===');
      console.log('Name:', room8.name);
      console.log('Room Number:', room8.roomNumber);
      console.log('Capacity object:', room8.capacity);
      console.log('Adults:', room8.capacity?.adults);
    } else {
      console.log('Room 8 not found in API response');
    }
    
    // Check a few other rooms
    const room10 = response.data.find(r => r.roomNumber === 'U02');
    const room1 = response.data.find(r => r.roomNumber === 'G01');
    
    console.log('\n=== OTHER ROOMS ===');
    console.log('Room 10 (U02) adults:', room10?.capacity?.adults);
    console.log('Room 1 (G01) adults:', room1?.capacity?.adults);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Backend server is not running!');
      console.log('Start it with: cd backend && npm run dev');
    }
  }
};

testAPI();
