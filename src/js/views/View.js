export default class View {
  _data;

  _clearParent() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const spinnermarkup = `
      <div class="spinner">
        <svg>
          <use href="./dist/assets/img/icons.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnermarkup);
  }

  renderError(message = this._messageError) {
    const errorMarkup = `
      <div class="error">
        <div>
          <svg>
            <use href="./dist/assets/img/icons.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderMessage(message = this._message) {
    const messageMarkup = `
      <div class="message">
        <div>
          <svg>
            <use href="./dist/assets/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', messageMarkup);
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clearParent();
    this._parentElement.innerHTML = markup;
  }

  updateChanges(data) {
    // if (!data || (Array.isArray(data) && data.length == 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();

    if (!newMarkup) return;

    //  create a virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newElt, i) => {
      const curEl = currentElements[i];
      // console.log(curEl, newElt.isEqualNode(curEl));

      // Update changed TEXT
      if (
        !newElt.isEqualNode(curEl) &&
        newElt.firstChild?.nodeValue.trim() !== ''
      ) {
        // curEl.innerHTML = newElt.innerHTML;
        curEl.textContent = newElt.textContent;
      }

      // Update changed ATTR
      if (!newElt.isEqualNode(curEl)) {
        Array.from(newElt.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
}
