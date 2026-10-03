const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  try {
    // Find the city's coordinates
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );

    const locationData = await locationResponse.json();

    if (!locationData.results) {
      alert("City not found.");
      return;
    }

    const location = locationData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;

    // Get weather information
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
    );

    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    cityName.textContent = `${location.name}, ${location.country}`;

    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;

    humidity.textContent = `${current.relative_humidity_2m}%`;

    windSpeed.textContent = `${current.wind_speed_10m} km/h`;

    weatherDescription.textContent = getWeatherDescription(
      current.weather_code,
    );
  } catch (error) {
    console.error(error);

    alert("Something went wrong. Please try again.");
  }
}

function getWeatherDescription(code) {
  if (code === 0) {
    return "Clear sky";
  }

  if (code === 1 || code === 2 || code === 3) {
    return "Partly cloudy";
  }

  if (code === 45 || code === 48) {
    return "Foggy";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 71 && code <= 77) {
    return "Snow";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 95) {
    return "Thunderstorm";
  }

  return "Unknown weather";
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
