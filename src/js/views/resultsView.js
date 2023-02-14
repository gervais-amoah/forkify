import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = '';
  _messageError = '😐 No recipe found for your search term.';

  _generateMarkup() {
    console.log('ResultsView => ', this._data);

    console.log('05..ResultsView.js');

    return this._data
      ?.map(resultRecipe => previewView.render(resultRecipe, false))
      .join('');
  }
}

export default new ResultsView();
