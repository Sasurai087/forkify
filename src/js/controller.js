import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

if(module.hot) {
  module.hot.accept();
}

//MVC ARCHITECTURE NOTES: CONTROLLER HANDLES USER INPUT AND ENACTS FUNCTIONS FROM MODEL AND VIEWS; PUT SIMPLY, IT DELEGATES;
//CODE RELATED TO DOM OR FETCHES DO NOT GO HERE

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1) || '5ed6604691c37cdc054bd01c';
  
    //Load Spinner while awaiting recipe
    if(!id) return;
    recipeView.renderSpinner()

    // 0. Update resultsView to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Load recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }

};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery() || 'curry';
    if(!query) return;
    
    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render search results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function(goToPage) {

  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function(newServings){
  // Update the recipe servings (within state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

//Initialization
const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
}
init();
