console.log("JS funcionando");

import { API_KEY } from "./config.js";

// ================= FETCH =================
async function fetchWeather(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&lang=pt`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }

  return response.json();
}

// ================= ADAPTADOR =================
function adaptWeatherData(data) {
  return {
    city: data.location.name,
    country: data.location.country,
    date: data.location.localtime,

    temperature: data.current.temp_c,
    feelsLike: data.current.feelslike_c,
    humidity: data.current.humidity,
    wind: data.current.wind_kph,
    precipitation: data.current.precip_mm,

    icon: data.current.condition.text,

    daily: data.forecast.forecastday.map(day => ({
      day: day.date,
      icon: "🌤️",
      max: day.day.maxtemp_c,
      min: day.day.mintemp_c
    })),

    hourly: data.forecast.forecastday[0].hour.map(hour => ({
      time: hour.time.split(" ")[1],
      icon: "🌤️",
      temp: hour.temp_c
    }))
  };
}

// ================= RENDER =================

// Banner
function renderBannerInfo(data) {
  const caixa1 = document.querySelector(".caixa1 section");

  caixa1.innerHTML = `
    <div>
      <h2>${data.city}, ${data.country}</h2>
      <p>${data.date}</p>
    </div>

    <div>
      <p id="clima">${data.temperature}°C</p>
    </div>
  `;
}

// Infos do dia
function renderDayInfo(data) {
  const lista = document.querySelector(".info-clima ul");

  lista.innerHTML = `
    <li>
      <p>🌡 Sensação térmica</p>
      <span>${data.feelsLike}°C</span>
    </li>

    <li>
      <p>💧 Umidade</p>
      <span>${data.humidity}%</span>
    </li>

    <li>
      <p>🌬 Vento</p>
      <span>${data.wind} Km/h</span>
    </li>

    <li>
      <p>🌧 Chuva</p>
      <span>${data.precipitation} mm</span>
    </li>
  `;
}

// Semana
function renderDaily(dailyData) {
  const lista = document.querySelector(".caixa1 section ul");
  lista.innerHTML = "";

  dailyData.forEach(day => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${day.day} <br>
      ${day.icon} <br>
      ${day.max}° ${day.min}°
    `;

    lista.appendChild(li);
  });
}

// Horas
function renderHourly(hourlyData) {
  const lista = document.querySelector(".caixa2 ul");
  lista.innerHTML = "";

  hourlyData.forEach(hour => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${hour.icon} ${hour.time}
      <span>${hour.temp}°C</span>
    `;

    lista.appendChild(li);
  });
}

function renderPage(data) {
  renderBannerInfo(data);
  renderDayInfo(data);
  renderDaily(data.daily);
  renderHourly(data.hourly);
}


async function start() {
  const data = await fetchWeather("São Paulo");
  const adapted = adaptWeatherData(data);

  renderPage(adapted);
}

start();

const input = document.querySelector("#pesquisa input");
const button = document.querySelector("#pesquisa button");

button.addEventListener("click", async () => {
  const city = input.value;

  if (!city) return;

  try {
    const data = await fetchWeather(city);
    const adapted = adaptWeatherData(data);

    renderPage(adapted);

    localStorage.setItem("cidade", city);

  } catch (error) {
    alert("Erro ao buscar cidade!");
    console.error(error);
  }
});


window.addEventListener("load", async () => {
  const cidadeSalva = localStorage.getItem("cidade");

  if (cidadeSalva) {
    const data = await fetchWeather(cidadeSalva);
    const adapted = adaptWeatherData(data);

    renderPage(adapted);
  }
});