import icons from 'url:../../img/icons.svg'; //url param is needed for Parcel2 to import static files

//View class contains methods that are shared throughout all the views;
//Gain access to this class by ensuring the child views 'extends' this View

export default class View {
  _data;

  render(data){
    //Throw error if there is no data, or if received data is blank
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    //recipe data from model.state.recipe is stored in #data
    this._data = data;
    const markup = this._generateMarkup();
    // Emptying container to remove 'please search for recipe' message
    this._clear();
    // Insert markup inside recipeContainer, before its first child
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear(){
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  };

  renderMessage(message = this._message) {
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

  renderError(message = this._errorMessage){
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}