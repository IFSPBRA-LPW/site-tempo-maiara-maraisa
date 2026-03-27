console.log("JS funcionando");
import { cityWeather } from "./data.js";

// Banner (caixa principal)
function renderBannerInfo(data) {
  const caixa1 = document.querySelector(".caixa1 section");

  caixa1.innerHTML = `
    <div>
      <h2>${data.city}, ${data.country}</h2>
      <p>${data.date}</p>
    </div>

    <div>
      <p id="clima">${data.icon} ${data.temperature}°C</p>
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

// Por hora
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

// Função principal
function renderPage(data) {
  renderBannerInfo(data);
  renderDayInfo(data);
  renderDaily(data.daily);
  renderHourly(data.hourly);
}

// chamada final
renderPage(cityWeather);