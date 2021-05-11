var _model = require('./model');
var _viewsRecipeView = require('./views/recipeView');
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
var _viewsRecipeViewDefault = _parcelHelpers.interopDefault(_viewsRecipeView);
var _urlImgIconsSvg = require('url:../img/icons.svg');
var _urlImgIconsSvgDefault = _parcelHelpers.interopDefault(_urlImgIconsSvg);
require('core-js/stable');
require('regenerator-runtime');
const recipeContainer = document.querySelector('.recipe');
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${_urlImgIconsSvgDefault.default}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};
const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    renderSpinner(recipeContainer);
    // Step 1. Load recipe
    await _model.loadRecipe(id);
    const recipe = _model.state.recipe;
    console.log(recipe);
    // Step 2. Rendering recipe
    _viewsRecipeViewDefault.default.render(_model.state.recipe);
  } catch (err) {
    alert(err);
  }
};
// Runs showRecipe when hash changes (user clicks on recipe) or when page loads (user inputs url)
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));