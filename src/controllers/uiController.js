import "../css/josh-comeau-reset.css";
import "../css/xobett-reset.css";
import "../css/variables.css";
import "../css/components.css";
import "../css/main.css";

export class UiController {
  #currentCondition;
  #resolvedAddress;
  #currentTemp;
  #nextDays;
  #sunriseTime;
  #humidity;
  #windSpeed;
  #sunsetTime;

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
  }

  renderData(data) {
    this.#updateCurrentInfoSection(data.currentInfo);
    this.#updateNextDaysSection(data.nextDays);
    this.#updateConditionsSection(data.conditions);
  }

  #updateCurrentInfoSection(data) {
    this.#currentCondition.textContent = data.currentCondition;
    this.#resolvedAddress.textContent = data.resolvedAddress;
    this.#currentTemp.textContent = `${data.currentTemp}° F`;
  }
  #updateNextDaysSection(data) {
    for (let i = 0; i < this.#nextDays.length; i++) {
      const element = this.#nextDays[i];
      let weekday = new Date(data[i].dateTime);
      weekday = weekday.toLocaleDateString("en-US", { weekday: "short" });
      element.querySelector(".weekday").textContent = weekday;
      element.querySelector(".temp").textContent = `${data[i].temp}° F`;
    }
  }
  #updateConditionsSection(data) {
    this.#sunriseTime.textContent = data.sunriseTime.slice(0, 5);
    this.#windSpeed.textContent = data.windSpeed;
    this.#humidity.textContent = data.humidity;
    this.#sunsetTime.textContent = data.sunsetTime.slice(0, 5);
  }

  get LocationForm() {
    return document.getElementById("location-form");
  }
}
