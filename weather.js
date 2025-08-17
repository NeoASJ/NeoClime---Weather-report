export async function handler(event) {
  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const city = params.get("city");
    const units = params.get("units") || "metric";

    if (!city) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing city parameter" }) };
    }

    const apiKey = process.env.OPENWEATHER_API_KEY; // set in Netlify env
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ message: "Server misconfig: missing API key" }) };
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const resp = await fetch(apiUrl);
    const data = await resp.json();

    return {
      statusCode: resp.ok ? 200 : (data.cod || 500),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: "Internal error", error: String(e) }) };
  }
}
