// api.js
export const getPlaceDetails = async (place) => {
  const nominatimURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`;

  const response = await fetch(nominatimURL, {
    headers: {
      "User-Agent": "MyApp/1.0", 
    },
  });

  const data = await response.json();
  return data;
};
