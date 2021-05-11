import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id)
  
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

const init = function() {
  recipeView.addHandlerRender(controlRecipes)
}

init();
