// import { loadRecipe } from './model';
import {
  loadRecipe,
  state,
  loadSearchResult,
  getSearchResultsPage,
  updateServings,
  addBookmark,
  removeBookmark,
  uploadRecipe,
} from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

// RECIPE CONTROL
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.updateChanges(getSearchResultsPage());
    bookmarksView.updateChanges(state.bookmarks);

    await loadRecipe(id);

    //  2-RENDERING THE RECIPE
    recipeView.render(state.recipe);
  } catch (error) {
    // alert('Error while showing the recipe, from the controller');
    recipeView.renderError();
    console.error(error);
  }
};

// SEARCH CONTROL
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //  Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load the seach results
    await loadSearchResult(query);

    // Show the results
    // resultsView.render(state.search.results);
    resultsView.render(getSearchResultsPage(1));

    //  Initial pagination btns
    paginationView.render(state.search);
  } catch (error) {
    console.log(error);
  }
};

// PAGINATION CONTROL
const controlPagination = function (gotoPage) {
  //  Go to the new page
  resultsView.render(getSearchResultsPage(gotoPage));
  //  Render new pagination btns
  paginationView.render(state.search);
};

// SERVINGS CONTROL
const controlServings = function (val) {
  //  Update the recipe servings
  updateServings(val);

  //  Update the recipe view
  // recipeView.render(state.recipe);
  recipeView.updateChanges(state.recipe);
};

function controlAddBookmark() {
  // Add/REmove bookmar
  if (state.recipe.bookmarked) {
    removeBookmark(state.recipe.id);
  } else {
    addBookmark(state.recipe);
  }

  // Update recipe view
  recipeView.updateChanges(state.recipe);

  // Render bookmarks
  bookmarksView.render(state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    //  Show loading spinner
    addRecipeView.renderSpinner();

    await uploadRecipe(newRecipe);

    //  render the created recipe in the recipe view
    recipeView.render(state.recipe);

    //  Success message
    addRecipeView.renderMessage();

    // re-render the bookmark view
    bookmarksView.render(state.bookmarks);

    // set the id in the URL
    window.history.pushState(null, '', `#${state.recipe.id}`);

    //  close add recipe modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //  RESET ADD RECIPE VIEW
    addRecipeView.render('default content');
  } catch (error) {
    console.error('ooooh', error);
    addRecipeView.renderError(error.message);
    setTimeout(function () {
      //  RESET ADD RECIPE VIEW
      addRecipeView.render('default content');
    }, MODAL_CLOSE_SEC * 2000);
  }
}

// INIT
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandelerUpload(controlAddRecipe);
};

init();
