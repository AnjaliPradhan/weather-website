// =================================================================================================
// IMPORTANT: API Key Setup
// You MUST replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key from OpenWeatherMap.
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account.
// 3. Find your API key on your account dashboard.
// 4. Paste it below:
// =================================================================================================
const API_KEY = '1809bd16fd44fc88a3b64338c18df800'; // <--- REPLACE THIS WITH YOUR ACTUAL API KEY!
// =================================================================================================


// Get DOM elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationName = document.getElementById('location-name');
const dateElement = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const feelsLikeElement = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast-container');
const weatherDisplay = document.getElementById('weather-display');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');

// Define a mapping of OpenWeatherMap icon codes to your local icon filenames (PNG format)
// Ensure you have these files in your 'assets/' folder (e.g., assets/clear.png, assets/rain.png)
const iconMapping = {
    // Main weather conditions (OpenWeatherMap codes)
    '01d': 'clear.png',             // Clear sky (day)
    '01n': 'clear.png',             // Clear sky (night) - using clear.png for simplicity
    '02d': 'clouds.png',            // Few clouds (day)
    '02n': 'clouds.png',            // Few clouds (night)
    '03d': 'clouds.png',            // Scattered clouds (day)
    '03n': 'clouds.png',            // Scattered clouds (night)
    '04d': 'clouds.png',            // Broken clouds (day) - using general clouds icon
    '04n': 'clouds.png',            // Broken clouds (night) - using general clouds icon
    '09d': 'drizzle.png',           // Shower rain (day) - mapped to drizzle
    '09n': 'drizzle.png',           // Shower rain (night) - mapped to drizzle
    '10d': 'rain.png',              // Rain (day)
    '10n': 'rain.png',              // Rain (night)
    '11d': 'rain.png',              // Thunderstorm (day) - mapped to rain as closest general icon
    '11n': 'rain.png',              // Thunderstorm (night) - mapped to rain as closest general icon
    '13d': 'snow.png',              // Snow (day)
    '13n': 'snow.png',              // Snow (night)
    '50d': 'mist.png',              // Mist (day)
    '50n': 'mist.png',              // Mist (night)

    // Specific detail icons (for reference, if you decide to add them to the UI later)
    'humidity': 'humidity.png',
    'wind': 'wind.png',
    'search': 'search.png', // For the search button

    'default': 'clear.png'       // Fallback icon for unmapped codes
};

/**
 * Fetches weather data for a given city from OpenWeatherMap API.
 * @param {string} city - The name of the city to fetch weather for.
 */
async function getWeatherData(city) {
    // Check if the API key is still the placeholder
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
        errorMessage.textContent = 'Please replace "YOUR_OPENWEATHERMAP_API_KEY" in the script with your actual OpenWeatherMap API key.';
        errorMessage.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
        loadingIndicator.classList.add('hidden');
        return; // Stop execution if API key is not set
    }

    // Show loading indicator and hide previous content/errors
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');

    try {
        // Fetch current weather data
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        // Handle city not found or other API errors
        if (currentWeatherData.cod === '404') {
            errorMessage.textContent = 'City not found. Please check the spelling and try again.';
            errorMessage.classList.remove('hidden');
            return;
        }
        if (!currentWeatherResponse.ok) {
            // If the response is not OK, it might be an API key issue or other server error
            const errorDetails = currentWeatherData.message || 'Failed to fetch current weather data.';
            throw new Error(errorDetails);
        }

        // Fetch 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
            const errorDetails = forecastData.message || 'Failed to fetch forecast data.';
            throw new Error(errorDetails);
        }

        // Update the UI with the fetched data
        updateUI(currentWeatherData, forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Display a more specific error message if it's an API key issue
        if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
            errorMessage.textContent = 'Invalid API key. Please ensure your OpenWeatherMap API key is correct and activated. It might take a few minutes for a new key to become active.';
        } else {
            errorMessage.textContent = `Error: ${error.message}. Please try again later.`;
        }
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide loading indicator regardless of success or failure
        loadingIndicator.classList.add('hidden');
        // Only show weather display if there's no error, otherwise show error message
        if (errorMessage.classList.contains('hidden')) {
            weatherDisplay.classList.remove('hidden');
        }
    }
}

/**
 * Updates the UI with current weather and forecast data.
 * @param {object} current - Current weather data object.
 * @param {object} forecast - 5-day forecast data object.
 */
function updateUI(current, forecast) {
    // Update Current Weather Section
    locationName.textContent = `${current.name}, ${current.sys.country}`;
    const currentDate = new Date(current.dt * 1000);
    dateElement.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Get icon filename from mapping, or use default if not found
    const currentIconCode = current.weather.length > 0 ? current.weather[0].icon : 'default';
    weatherIcon.src = `assets/${iconMapping[currentIconCode] || iconMapping['default']}`; // Changed path to assets/
    weatherIcon.alt = current.weather[0].description;
    temperatureElement.textContent = `${Math.round(current.main.temp)}°C`;
    descriptionElement.textContent = current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1);

    // Humidity, Wind Speed, Feels Like - these remain text-based for now as new icon elements would require
    // more significant HTML structure changes in the 'details' section.
    humidityElement.textContent = `${current.main.humidity}%`;
    windSpeedElement.textContent = `${current.wind.speed} m/s`;
    feelsLikeElement.textContent = `${Math.round(current.main.feels_like)}°C`;

    // Update 5-Day Forecast Section
    forecastContainer.innerHTML = ''; // Clear previous forecast cards

    const dailyForecasts = {};
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.getTime() > today.getTime() && Object.keys(dailyForecasts).length < 5) {
            const hour = date.getHours();
            if (!dailyForecasts[dayKey] || (hour >= 11 && hour <= 15)) {
                 dailyForecasts[dayKey] = {
                    temp: item.main.temp,
                    icon: item.weather[0].icon,
                    description: item.weather[0].description,
                    date: date
                };
            }
        }
    });

    // Render the forecast cards
    Object.values(dailyForecasts).forEach(dayData => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card', 'bg-blue-100', 'p-4', 'rounded-lg', 'shadow-sm', 'flex', 'flex-col', 'items-center', 'text-center', 'transition-transform', 'duration-200', 'hover:scale-105');

        // Get icon filename from mapping, or use default if not found
        const forecastIconCode = dayData.icon || 'default';
        const iconSrc = `assets/${iconMapping[forecastIconCode] || iconMapping['default']}`; // Changed path to assets/

        forecastCard.innerHTML = `
            <p class="text-sm font-semibold text-gray-700">${dayData.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</p>
            <img src="${iconSrc}" alt="${dayData.description}" class="w-16 h-16">
            <p class="text-xl font-bold">${Math.round(dayData.temp)}°C</p>
            <p class="text-xs text-gray-600 capitalize">${dayData.description}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        errorMessage.textContent = 'Please enter a city name.';
        errorMessage.classList.remove('hidden');
        weatherDisplay.classList.add('hidden'); // Hide weather display if input is empty
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Initial load: Get weather for a default city (e.g., your current location or a popular city)
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData('New York'); // Default city, you can change this
});

