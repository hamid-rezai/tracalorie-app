import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import CalorieTracker from "./Tracker";
import { Meal, Workout } from "./Item";
import "./css/style.css";
import "./css/bootstrap.css";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();

    this._tracker.loadItems();
    this._tracker.loadWorkoutItems();
  }
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }
  _newMeal(e) {
    e.preventDefault();

    const mealName = document.getElementById("meal-name");
    const mealCalories = document.getElementById("meal-calories");

    // Validate inputs
    if (mealName.value === "" || mealCalories.value === "") {
      alert("Please fill in all fields!");
      return;
    }

    const meal = new Meal(mealName.value, +mealCalories.value);
    this._tracker.addMeal(meal);

    mealName.value = "";
    mealCalories.value = "";

    const collapseMeal = document.getElementById("collapse-meal");
    const bsCollapse = new Collapse(collapseMeal);
  }

  _newWorkout(e) {
    e.preventDefault();

    const workoutName = document.getElementById("workout-name");
    const workoutCalories = document.getElementById("workout-calories");

    // Validate inputs
    if (workoutName.value === "" || workoutCalories.value === "") {
      alert("Please fill in all fields!");
      return;
    }

    const workout = new Workout(workoutName.value, +workoutCalories.value);
    this._tracker.addWorkout(workout);

    workoutName.value = "";
    workoutCalories.value = "";

    const collapseWorkout = document.getElementById("collapse-workout");
    const bsCollapse = new Collapse(collapseWorkout);
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please set a daily limit!");
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const modalEl = document.getElementById("limit-modal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
