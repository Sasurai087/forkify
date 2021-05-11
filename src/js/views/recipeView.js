import icons from 'url:../../img/icons.svg'; //url param is needed for Parcel2 to import static files
import {Fraction} from 'fractional';

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;
  #errorMessage = 'We could not find that recipe. Please try another one!';
  #message = '';

  render(data){
    //recipe data from model.state.recipe is stored in #data
    this.#data = data;
    const markup = this.#generateMarkup();
    // Emptying container to remove 'please search for recipe' message
    this.#clear();
    // Insert markup inside recipeContainer, before its first child
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear(){
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup)
  };

  renderMessage(message = this.#message) {
  const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
  }

  renderError(message = this.#errorMessage){
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

//PUBLISHER function that needs access to SUBSCRIBER (controlRecipes within controller.js)
  addHandlerRender(handler) {
  //Runs controlRecipes when hash changes (user clicks on recipe) or when page loads (user inputs url)
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  #generateMarkup() {
    return `
    <figure class="recipe__fig">
        <img src="${this.#data.image}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this.#data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg> 
          <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">

          ${this.#data.ingredients.map(this.#generateMarkupIngredient).join('')}

        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this.#data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
  `;
  }

  #generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>   
    `;
  }
}

export default new RecipeView();