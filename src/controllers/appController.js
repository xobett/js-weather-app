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
    this.#ui.render();
    console.log("App loaded");

    this.#ui.LocationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      let valid = true;

      const data = new FormData(form);
      const location = data.get("location");

      if (this.#isNotLetters(location) || this.#isWhiteSpace(location)) {
        valid = false;
        console.log("invalid");
      }

      if (valid) {
        console.log("fetching");
        this.#fetchForecast(location);
      }

      form.reset();
    });
  }

  #fetchForecast = async (loc) => {
    try {
      const url = `${this.#baseUrl}/${loc}?key=${this.#apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  #isNotLetters = (str) => !this.#onlyLettersRegex.test(str);
  #isWhiteSpace = (str) => String(str).trim().length === 0;
}
