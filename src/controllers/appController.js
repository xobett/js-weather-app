export class AppController {
  #ui;
  #baseUrl =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
  #apiKey = "282U6PAND3F8GDGLJYD3NB7XX";
  #onlyLettersRegex = /^[A-Za-z\s,.'-]+$/;

  constructor(ui) {
    this.#ui = ui;
  }

  init() {
    this.#ui.LocationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      let valid = true;

      const data = new FormData(form);
      const location = data.get("location");

      if (this.#isNotLetters(location) || this.#isWhiteSpace(location)) {
        valid = false;
      }

      if (valid) {
        this.#fetchForecastAsync(location);
      }

      form.reset();
    });
  }

  #fetchForecastAsync = async (loc) => {
    try {
      const url = `${this.#baseUrl}/${loc}?key=${this.#apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
      const data = this.#filterData(json);

      this.#ui.renderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  #filterData = (json) => {
    const data = {
      currentInfo: {
        currentCondition: json.currentConditions.conditions,
        resolvedAddress: json.resolvedAddress,
        currentTemp: json.currentConditions.temp,
      },
      nextDays: [],
      conditions: {
        sunriseTime: json.currentConditions.sunrise,
        windSpeed: json.currentConditions.windspeed,
        humidity: json.currentConditions.humidity,
        sunsetTime: json.currentConditions.sunset,
      },
    };

    for (let i = 0; i < 4; i++) {
      const day = {
        dateTime: json.days[i + 1].datetime,
        conditions: json.days[i + 1].conditions,
        temp: json.days[i + 1].temp,
      };

      data.nextDays.push(day);
    }

    return data;
  };

  #isNotLetters = (str) => !this.#onlyLettersRegex.test(str);
  #isWhiteSpace = (str) => String(str).trim().length === 0;
}
