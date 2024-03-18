import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconmap";

navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);

function geoSuccess({ coords }) {
  const { latitude, longitude } = coords;

  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
    .then(res => res.json())
    .then(data => {
      const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "";
      const province = data.address.state || data.address.region || "";
      const country = data.address.country || "";

      document.getElementById("city").textContent = city;
      document.getElementById("province").textContent = province;
      document.getElementById("country").textContent = country;

      getWeather(
        latitude,
        longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )
      .then(weatherData => renderWeather(weatherData, city, province, country))
    })
    .catch(e => {
      console.error(e);
      alert("Error fetching weather information.");
    });
};

function geoFailure() {
  alert("There was an error getting your location. Allow permision to use your location and reload the page.");
};

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
};

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
};

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
};

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-wind", current.windSpeed);
  setValue("current-low", current.lowTemp);
  setValue("current-rain-prob", current.rainProbability);
};

const dailySection = document.querySelector("[data-day-section");

const dayCardTemplate = document.getElementById("day-card-template");

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" });

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day, index) => {
    if (index === 0) return;
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  })
};

const hourlySection = document.querySelector("[data-hour-section]");

const hourRowTemplate = document.getElementById("hour-row-template");

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.slice(0, 24).forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("rain-prob", hour.rainProbability, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  })
};
