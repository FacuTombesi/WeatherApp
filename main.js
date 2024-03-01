import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconmap";

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(renderWeather)
  .catch(e => {
    console.error(e);
    alert("Error fetching weather information.");
  });

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  // renderDailyWeather(daily);
  // renderHourlyWeather(hourly);
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
