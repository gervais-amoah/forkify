import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = '';
  _messageError = '😉 No bookmarks yet. Find a nice recipe and bookmark it';
  y;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      ?.map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
