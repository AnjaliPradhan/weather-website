# weather-website
# Dynamic Weather Dashboard
This is a modern and interactive weather dashboard web application that displays current weather conditions and a 5-day forecast for any given city. It features a clean, responsive design with attractive color gradients and custom weather icons.

**Features:**
Current Weather Display: Shows current temperature, "feels like" temperature, weather description, humidity, wind speed, and the current date.

5-Day Forecast: Provides a daily forecast summary with temperature, weather icon, and description for the upcoming days.

City Search: Allows users to search for weather information by entering a city name.

Custom Icons: Utilizes a set of custom PNG icons for various weather conditions, including clear, clouds, drizzle, mist, rain, snow, and a search icon for the input button.

Attractive UI: Features a vibrant pink and green background gradient, a "frosted glass" effect for the dashboard, and gradient-styled buttons.

Responsive Design: Optimized for seamless viewing and interaction across various devices (mobile, tablet, desktop).

Error Handling: Provides user-friendly messages for invalid city names or API key issues.

Technologies Used
HTML5: For the core structure of the web application.

Tailwind CSS: A utility-first CSS framework used for rapid and responsive styling.

JavaScript (ES6+): Powers the dynamic fetching and display of weather data, and handles user interactions.

OpenWeatherMap API: Used to retrieve real-time weather data and forecasts.

Google Fonts (Inter): For a clean and modern typography.

Setup and Installation
To get this project up and running on your local machine, follow these steps:

**Clone the Repository:**

git clone <repository-url>
cd dynamic-weather-dashboard

**Obtain an OpenWeatherMap API Key:**

Go to the OpenWeatherMap API website.

Sign up for a free account.

Once logged in, navigate to your API keys section to find your personal API key.

**Configure the API Key:**

Open the script.js file in your project directory.

**Locate the line:**

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <--- REPLACE THIS WITH YOUR ACTUAL API KEY!

Replace 'YOUR_OPENWEATHERMAP_API_KEY' with the API key you obtained from OpenWeatherMap.
(Note: The current script.js in the Canvas already has a placeholder key 1809bd16fd44fc88a3b64338c18df800. You should still replace this with your own key for long-term use, as shared keys might have rate limit issues.)

**Add Custom Icons:**

Create a new folder named assets in the root of your project directory (next to index.html, style.css, and script.js).

Download or create .png image files for the following weather conditions and place them inside the assets folder:

clear.png

clouds.png

drizzle.png

humidity.png (for potential future use in details, not currently displayed as icon)

mist.png

rain.png

search.png (for the search button)

snow.png

wind.png (for potential future use in details, not currently displayed as icon)

default.png (a generic fallback icon)

**Run the Application:**

Simply open the index.html file in your web browser. There's no need for a local server as it's a client-side only application.

**Project Structure**
.
├── index.html          # Main HTML file defining the page structure
├── style.css           # Custom CSS for additional styling and overrides
├── script.js           # JavaScript for all dynamic functionality and API calls
└── assets/             # Directory for custom weather icons (PNG format)
    ├── clear.png
    ├── clouds.png
    ├── drizzle.png
    ├── humidity.png
    ├── mist.png
    ├── rain.png
    ├── search.png
    ├── snow.png
    ├── wind.png
    └── default.png

**Usage**
Enter a City: Type the name of a city into the input field.

Search: Click the "Search" button or press Enter.

View Weather: The current weather conditions and a 5-day forecast for the entered city will be displayed.
