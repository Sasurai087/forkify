import icons from 'url:../../img/icons.svg'; //url param is needed for Parcel2 to import static files

//View class contains methods that are shared throughout all the views;
//Gain access to this class by ensuring the child views 'extends' this View

export default class View {
  _data;

  render(data, render = true){
    //Throw error if there is no data, or if received data is blank
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    //recipe data from model.state.recipe is stored in #data
    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;

    // Emptying container to remove 'please search for recipe' message
    this._clear();
    // Insert markup inside recipeContainer, before its first child
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  //Use this to 'update' sections of a view, instead of re-rendering the whole thing
  update(data){
    this._data = data;
    
    //Create a new markup and compare to the old one, and only change elements that are new
    const newMarkup = this._generateMarkup();
    //Take newMarkup and turn it into a virtualDOM that lives in memory
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //Select all elements of the new DOM, as well as old DOM
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Updates changed TEXT
      if(
        !newEl.isEqualNode(curEl) && 
        newEl.firstChild?.nodeValue.trim() !== ''
        ) {
          curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if(!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach(attr => 
          curEl.setAttribute(attr.name, attr.value)
          );
        };
      
      //Note: InnerHTML may be used as an alternative to textContent and setAttribute. Have not tested.
    });
  };

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