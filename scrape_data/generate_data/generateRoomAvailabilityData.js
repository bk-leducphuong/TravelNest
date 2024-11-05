const MAX_DATA_LIMIT = 500;
const MAX_ROOM_ID = 70;

function getRandomDateWithinOneMonth(from = new Date()) {
  const randomDays = Math.floor(Math.random() * 31);
  const randomDate = new Date(from);
  randomDate.setDate(from.getDate() + randomDays);
  return randomDate.toISOString().split('T')[0];
}

function generateRoomAvailabilityData() {
  const data = [];
  
  for (let i = 1; i <= MAX_DATA_LIMIT; i++) {
    const availableFrom = getRandomDateWithinOneMonth();
    const availableTo = getRandomDateWithinOneMonth(new Date(availableFrom));
    
    data.push({
      room_id: Math.floor(Math.random() * MAX_ROOM_ID),
      available_from: availableFrom,
      available_to: availableTo,
    });
  }

  return data;
}

module.exports = { generateRoomAvailabilityData};

