import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function convertRecipeDataToObject(data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

// LOAD RECIPE DETAILS
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL + id}?key=${API_KEY}`);

    state.recipe = convertRecipeDataToObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id == id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error('Error while retreiving recipe from API\n', error);
    throw error;
  }
};

// SEARCH RECIPE
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (error) {
    console.error('Error while searching the recipe from API\n', error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; //  9

  return state.search.results.slice(start, end);
};

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id == state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persisteBookmarks();
}

export function removeBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id == id);
  state.bookmarks.splice(index, 1);

  if (id == state.recipe.id) state.recipe.bookmarked = false;

  persisteBookmarks();
}

function persisteBookmarks() {
  localStorage.setItem('forkifyBookmark', JSON.stringify(state.bookmarks));
}

function init() {
  const storedBookmarks = localStorage.getItem('forkifyBookmark');
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
}

init();

function clearBookmarks() {
  localStorage.clear('forkifyBookmark');
}
// clearBookmarks()

export async function uploadRecipe(newRecipe) {
  try {
    // console.log('new recipe recived:\n', Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(elt => elt.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length != 3) {
          throw new Error(
            '😐 Wrong ingredient format! Please use the correct format'
          );
        }

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = convertRecipeDataToObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
