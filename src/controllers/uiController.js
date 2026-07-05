import "../css/josh-comeau-reset.css";
import "../css/xobett-reset.css";
import "../css/variables.css";
import "../css/components.css";
import "../css/main.css";
import { icons } from "../icons/icons.js";

export class UiController {
  #currentCondition;
  #resolvedAddress;
  #currentTemp;
  #nextDays;
  #sunriseTime;
  #humidity;
  #windSpeed;
  #sunsetTime;
  #loadingScreen;

  constructor() {
    this.#getRefs();
  }

  #getRefs() {
    this.#currentCondition = document.getElementById("current-condition");
    this.#resolvedAddress = document.getElementById("resolved-address");
    this.#currentTemp = document.getElementById("current-temp");
    this.#nextDays = document.querySelectorAll(".next-day");
    this.#sunriseTime = document.getElementById("sunrise-time");
    this.#humidity = document.getElementById("humidity");
    this.#windSpeed = document.getElementById("wind-speed");
    this.#sunsetTime = document.getElementById("sunset-time");
    this.#loadingScreen = document.getElementById("loading-screen");
  }

  renderData(data) {
    this.#updateCurrentInfoSection(data.currentInfo);
    this.#updateNextDaysSection(data.nextDays);
    this.#updateConditionsSection(data.conditions);
  }

  #updateCurrentInfoSection(data) {
    this.#currentCondition.textContent = data.currentCondition;
    this.#resolvedAddress.textContent = data.resolvedAddress;
    this.#currentTemp.textContent = this.CelsiusDisplayed
      ? `${data.currentTemp} °C`
      : `${data.currentTemp} °F`;
  }
  #updateNextDaysSection(data) {
    for (let i = 0; i < this.#nextDays.length; i++) {
      const element = this.#nextDays[i];
      let weekday = new Date(data[i].dateTime);
      weekday = weekday.toLocaleDateString("en-US", { weekday: "short" });
      element.querySelector(".weekday").textContent = weekday;
      const iconKey = Object.keys(icons).find((key) => {
        const condition = data[i].conditions.toLowerCase();
        return condition.includes(key);
      });
      let icon = icons[iconKey];

      //Fallback
      if (icon === undefined) icon = icon["cloudy"];

      const iconContainer = element.querySelector(".icon-container");
      iconContainer.replaceChildren();
      iconContainer.insertAdjacentHTML("beforeend", icon);
      element.querySelector(".temp").textContent = this.CelsiusDisplayed
        ? `${data[i].temp} °C`
        : `${data[i].temp} °F`;
      element.querySelector(".cond").textContent = data[i].conditions;
    }
  }
  #updateConditionsSection(data) {
    this.#sunriseTime.textContent = data.sunriseTime.slice(0, 5);
    this.#windSpeed.textContent = data.windSpeed + " mph";
    this.#humidity.textContent = data.humidity + "%";
    this.#sunsetTime.textContent = data.sunsetTime.slice(0, 5);
  }

  get LocationForm() {
    return document.getElementById("location-form");
  }

  get ToggleMeasureBtn() {
    return document.getElementById("toggle-measure");
  }

  get Temps() {
    return document.querySelectorAll("#current-temp, .temp");
  }

  get TempsHaveNoData() {
    return Array.from(this.Temps).some((temp) => temp.textContent === "--");
  }

  get CelsiusDisplayed() {
    return this.ToggleMeasureBtn.getAttribute("data-celsius") === "true";
  }

  enableLoadingScreen() {
    this.#loadingScreen.style.display = "flex";
  }

  disableLoadingScreen() {
    this.#loadingScreen.style.display = "none";
  }
}
