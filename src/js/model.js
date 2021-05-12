import { async } from 'regenerator-runtime';
import {API_URL, RESULTS_PER_PAGE} from './config.js'
import {getJSON} from './helpers.js'

//MVC ARCHITECTURE NOTES: MODEL IS ONLY CONCERNED WITH BUSINESS LOGIC, SUCH AS FETCHING DATA FROM API OR MANAGING STATE
//MODEL IS NOT AWARE OF CONTROLLER OR VIEWS

//STATE
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
}

//RECIPE FETCH
export const loadRecipe = async function(id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const {recipe} = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    }
  } catch (error) {
    //Temporary error handling
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

//SEARCH FUNCTIONS
export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`)

    state.search.results = data.data.recipes.map(recipe => {
      return {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          image: recipe.image_url,
      };
    });
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage // 0;
  const end = page * state.search.resultsPerPage// 9;
  return state.search.results.slice(start, end);
}

//SERVINGS
export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // New Quantity = old Quantity * new Servings / oldServing
  });

  state.recipe.servings = newServings;
}