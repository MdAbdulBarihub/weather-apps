const apiKey = 'abcd1234efgh5678'; // Replace with your actual OpenWeatherMap API key

// Function to fetch and display weather data
async function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Use OpenWeatherMap Geocoding API to get lat and lon from the city name
  const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (geoData.cod !== 200) {
      alert(geoData.message);
      return;
    }

    const { lat, lon } = geoData.coord;
    displayWeather(geoData);
    getForecast(lat, lon);
  } catch (error) {
    console.error(error);
    alert('Something went wrong while fetching city coordinates. Please try again later.');
  }
}

// Display current weather info
function displayWeather(data) {
  const { name, main, weather, wind } = data;

  document.getElementById('city-name').textContent = name;
  document.getElementById('temperature').textContent = `Temperature: ${Math.round(main.temp - 273.15)}°C`; // Convert Kelvin to Celsius
  document.getElementById('weather-condition').textContent = `Weather: ${weather[0].description}`;
  document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${wind.speed} m/s`;

  // Animate weather update
  gsap.fromTo(".weather-info", { opacity: 0 }, { opacity: 1, duration: 1 });
}

// Function to fetch and display 5-day weather forecast
async function getForecast(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Display 5-day forecast (every 8th item in the list represents a new day)
    data.list.filter((item, index) => index % 8 === 0).forEach((forecast) => {
      const { dt_txt, main, weather } = forecast;
      const day = new Date(dt_txt).toLocaleString('en', { weekday: 'short' });

      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card');
      
      forecastCard.innerHTML = `
        <h4>${day}</h4>
        <p>${Math.round(main.temp)}°C</p>
        <img src="http://openweathermap.org/img/w/${weather[0].icon}.png" alt="${weather[0].description}">
        <p>${weather[0].description}</p>
      `;
      
      forecastContainer.appendChild(forecastCard);
    });
    
    // Animate forecast update
    gsap.fromTo(".forecast-card", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.2 });
  } catch (error) {
    console.error(error);
    alert('Error fetching forecast data');
  }
}
