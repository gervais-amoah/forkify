class SearchView {
  #parentElement = document.querySelector('.search');
  #searchTerm = '';

  getQuery() {
    this.#searchTerm =
      this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return this.#searchTerm;
  }

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
