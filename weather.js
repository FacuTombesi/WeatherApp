import axios from "axios";

export const getWeather = (lat, lon, timezone) => {
  return axios.get("https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timeformat=unixtime", {
    params: {
      latitude: lat,
      longitude: lon,
      timezone,
    },
  })
  .then(({ data }) => {
    // return data;
    return {
      current: parseCurrentWeather(data),
      daily: parseDailyWeather(data),
      hourly: parseHourlyWeather(data),
    }
  });
};

const parseCurrentWeather = ({ current, daily }) => {
  const {
    temperature_2m: currentTemp,
    wind_speed_10m: windSpeed,
    weather_code: iconCode
  } = current;

  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    precipitation_probability_max: [rainProbability],
  } = daily

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    windSpeed: Math.round(windSpeed),
    rainProbability: Math.round(rainProbability),
    iconCode,
  };
};

const parseDailyWeather = ({ daily }) => {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weather_code[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
};

const parseHourlyWeather = ({ hourly, current }) => {
  return hourly.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: hourly.weather_code[index],
      temp: Math.round(hourly.temperature_2m[index]),
      rainProbability: Math.round(hourly.precipitation_probability[index]),
      windSpeed: Math.round(hourly.wind_speed_10m[index]),
    };
  }).filter(({ timestamp }) => timestamp >= current.time * 1000);
};
