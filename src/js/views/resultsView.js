import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = '';
  _messageError = '😐 No recipe found for your search term.';

  _generateMarkup() {
    return this._data
      ?.map(resultRecipe => previewView.render(resultRecipe, false))
      .join('');
  }
}

export default new ResultsView();
