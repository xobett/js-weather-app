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
        this.#ui.enableLoadingScreen();
        this.#fetchForecastAsync(location);
      }

      form.reset();
    });

    this.#ui.ToggleMeasureBtn.addEventListener("click", (e) => {
      const temps = this.#ui.Temps;

      if (this.#ui.TempsHaveNoData) return;

      const celsiusDisplayed = this.#ui.CelsiusDisplayed;

      if (celsiusDisplayed) {
        temps.forEach((temp) => {
          const str = String(temp.textContent).replace(" °C", "").trim();
          const farenheit = Number(str);
          temp.textContent = `${this.#celsiusToFarenheit(farenheit)} °F`;
        });

        this.#ui.ToggleMeasureBtn.textContent = "°F";
      } else {
        temps.forEach((temp) => {
          const str = String(temp.textContent).replace(" °F", "").trim();
          const celsius = Number(str);
          temp.textContent = `${this.#farenheitToCelsius(celsius)} °C`;
          this.#ui.ToggleMeasureBtn.textContent = "°F";
        });
      }

      e.target.setAttribute("data-celsius", String(!celsiusDisplayed));
    });

    //Load initial weather
    this.#ui.enableLoadingScreen();
    this.#fetchForecastAsync("Queens, NY");
  }

  #farenheitToCelsius(farenheit) {
    const result = ((farenheit - 32) * 5) / 9;
    return Math.trunc(result);
  }

  #celsiusToFarenheit(celsius) {
    const result = (celsius * 9) / 5 + 32;
    return Math.trunc(result);
  }

  #fetchForecastAsync = async (loc) => {
    try {
      const url = `${this.#baseUrl}/${loc}?key=${this.#apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
      const data = this.#filterData(json);

      console.log(data);
      this.#ui.renderData(data);
      this.#ui.disableLoadingScreen();
    } catch (error) {
      console.log(error);
    }
  };

  #filterData = (json) => {
    let currentTemp = json.currentConditions.temp;
    if (this.#ui.CelsiusDisplayed) {
      currentTemp = this.#farenheitToCelsius(currentTemp);
    }
    const data = {
      currentInfo: {
        currentCondition: json.currentConditions.conditions,
        resolvedAddress: json.resolvedAddress,
        currentTemp: currentTemp,
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
      let temp = json.days[i + 1].temp;
      if (this.#ui.CelsiusDisplayed) {
        temp = this.#farenheitToCelsius(temp);
      }
      const day = {
        dateTime: json.days[i + 1].datetime,
        conditions: json.days[i + 1].conditions,
        temp: temp,
      };

      data.nextDays.push(day);
    }

    return data;
  };

  #isNotLetters = (str) => !this.#onlyLettersRegex.test(str);
  #isWhiteSpace = (str) => String(str).trim().length === 0;
}
