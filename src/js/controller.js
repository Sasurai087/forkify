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

//MVC ARCHITECTURE NOTES: CONTROLLER HANDLES USER INPUT AND ENACTS FUNCTIONS FROM MODEL AND VIEWS
//CODE RELATED TO DOM OR FETCHES DO NOT GO HERE

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
  
    //Load Spinner while awaiting recipe
    if(!id) return;
    recipeView.renderSpinner()

    // Step 1. Load recipe
    await model.loadRecipe(id);

    //Step 2. Rendering recipe
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
    const query = searchView.getQuery();
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

//Initialization
const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
}
init();
