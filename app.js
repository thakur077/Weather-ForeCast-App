const API_KEY = 'e1909022eb88476b938232925251804'; // Weather API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locateBtn = document.getElementById('locateBtn');
const recentSearches = document.getElementById('recentSearches');
const currentWeather = document.getElementById('currentWeather');
const forecastCards = document.getElementById('forecastCards');

const fetchWeather = async (query) => {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=no&alerts=no`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    displayCurrent(data);
    displayForecast(data.forecast.forecastday);
    saveRecentSearch(data.location.name);
  } catch (err) {
    alert("Error: " + err.message);
  }
};

const displayCurrent = (data) => {
  currentWeather.classList.remove('hidden');
  document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
  document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById('weatherDesc').textContent = data.current.condition.text;
  document.getElementById('temperature').textContent = `Temp: ${data.current.temp_c}°C`;
  document.getElementById('wind').textContent = `Wind: ${data.current.wind_kph} km/h`;
  document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
};

const displayForecast = (days) => {
  forecastCards.innerHTML = '';
  days.forEach(day => {
    forecastCards.innerHTML += `
      <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md hover:shadow-lg border border-blue-200 transition hover:scale-[1.03] duration-300">
        <h3 class="font-semibold text-blue-700 text-center mb-2">${day.date}</h3>
        <img src="https:${day.day.condition.icon}" class="w-16 h-16 mx-auto mb-2" />
        <p class="text-center text-gray-600 text-sm mb-1">${day.day.condition.text}</p>
        <div class="text-sm text-gray-700 space-y-1">
          <p><strong>Min:</strong> ${day.day.mintemp_c}°C</p>
          <p><strong>Max:</strong> ${day.day.maxtemp_c}°C</p>
          <p><strong>Wind:</strong> ${day.day.maxwind_kph} km/h</p>
          <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
        </div>
      </div>
    `;
  });
};

const saveRecentSearch = (city) => {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem('recentCities', JSON.stringify(cities));
  }
  renderDropdown();
};

const renderDropdown = () => {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentSearches.innerHTML = '';
  if (cities.length > 0) {
    recentSearches.classList.remove('hidden');
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      recentSearches.appendChild(option);
    });
  } else {
    recentSearches.classList.add('hidden');
  }
};

// Get coordinates and reverse geocode using Weather API
const getLocationWeather = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const query = `${lat},${lon}`;
    fetchWeather(query);
  }, () => {
    alert("Unable to retrieve location.");
  });
};

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

locateBtn.addEventListener('click', getLocationWeather);

recentSearches.addEventListener('change', (e) => {
  if (e.target.value) fetchWeather(e.target.value);
});

// On loading
renderDropdown();