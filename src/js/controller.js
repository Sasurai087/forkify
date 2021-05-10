import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
  
  } catch (err) {
    alert(err)
  }
};

//Runs controlRecipes when hash changes (user clicks on recipe) or when page loads (user inputs url)
['hashchange', 'load'].forEach(ev =>window.addEventListener(ev, controlRecipes));
