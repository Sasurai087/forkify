import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SECONDS } from './config.js';

if(module.hot) {
  module.hot.accept();
}

//MVC ARCHITECTURE NOTES: CONTROLLER HANDLES USER INPUT AND ENACTS FUNCTIONS FROM MODEL AND VIEWS; PUT SIMPLY, IT DELEGATES;
//CODE RELATED TO DOM OR FETCHES DO NOT GO HERE

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1) || '5ed6604691c37cdc054bd01c';
  
    //Load Spinner while awaiting recipe
    recipeView.renderSpinner()

    // 0. Update resultsView to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 1. Load recipe
    await model.loadRecipe(id);
    
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

    // 3. Update bookmarks
    bookmarksView.update(model.state.bookmarks);

  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }

};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery('') || 'curry';
    if(!query) return;
    
    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render search results
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

const controlAddBookmark = function() {
  // 1. Add or Remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

//USER RECIPES
const controlAddRecipe = async function(newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe)

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SECONDS * 1000)
  } catch (error) {
    console.error('💥', error);
    addRecipeView.renderError(error.message);
  }  
}

const welcomeMessage = function () {
  console.log("Welcome to Forkify! Begin by entering a recipe you would like to look up.")
}

//Initialization
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  controlSearchResults();
  controlPagination(1);
  welcomeMessage();
}

init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}