const apiKey = 'cf3694e880007815a9c4a7f0618c7a5d';

const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById("error");

const units = "metric";
let temperatureSymbol = units === "imperial" ? "°F" : "°C";

async function fetchWeather() {
    try {
        // Hide weather card and clear previous content
        weatherContainer.style.display = "none";
        weatherContainer.style.opacity = 0;
        weatherContainer.innerHTML = "";
        error.innerHTML = "";
        error.style.display = "none";
        city.innerHTML = "";

        const userCity = document.getElementById("cityInput")?.value.trim();

        if (!userCity) {
            error.innerHTML = "Please enter a city, place, or country name.";
            error.style.display = "block";
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            userCity
        )}&appid=${apiKey}&units=${units}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod && data.cod !== 200) {
            error.innerHTML = data.message || "Failed to fetch weather data.";
            error.style.display = "block";
            return;
        }

        city.innerHTML = `Weather for ${data.name}, ${data.sys.country}`;

        // Convert unix times considering timezone offset
        const localTime = convertToLocalTime(data.dt, data.timezone);
        const sunrise = convertToLocalTime(data.sys.sunrise, data.timezone);
        const sunset = convertToLocalTime(data.sys.sunset, data.timezone);

        weatherContainer.innerHTML = `
            <div class="weather_description">
                <strong>Coords:</strong> (${data.coord.lat}, ${data.coord.lon})<br/>
                <strong>Temperature:</strong> ${data.main.temp}${temperatureSymbol} (feels like ${data.main.feels_like}${temperatureSymbol})<br/>
                <strong>Range:</strong> ${data.main.temp_min}${temperatureSymbol} - ${data.main.temp_max}${temperatureSymbol}<br/>
                <strong>Pressure:</strong> ${data.main.pressure} hPa<br/>
                <strong>Humidity:</strong> ${data.main.humidity}%<br/>
                <strong>Wind:</strong> ${data.wind.speed} m/s at ${data.wind.deg}°<br/>
                <strong>Clouds:</strong> ${capitalizeWords(data.weather[0].main)} (${capitalizeWords(data.weather[0].description)})<br/>
                <strong>Visibility:</strong> ${data.visibility} meters<br/>
                <strong>Sea Level:</strong> ${data.main.sea_level || "N/A"}<br/>
                <strong>Ground Level:</strong> ${data.main.grnd_level || "N/A"}<br/>
                <strong>Sunrise:</strong> ${sunrise}<br/>
                <strong>Sunset:</strong> ${sunset}<br/>
                <strong>Time of Reading:</strong> ${localTime}
            </div>
        `;

        
        weatherContainer.style.display = "block";
        setTimeout(() => {
            weatherContainer.style.opacity = 1;
        }, 10);

    } catch (err) {
        console.error(err);
        error.innerHTML = "Error fetching weather data.";
        error.style.display = "block";
    }
}

function convertToLocalTime(unixTime, timezoneOffset) {
    // unixTime and timezoneOffset are in seconds
    const localDate = new Date((unixTime + timezoneOffset) * 1000);
    return localDate.toLocaleString();
}

function capitalizeWords(text) {
    return text.replace(/\b\w/g, char => char.toUpperCase());
}
