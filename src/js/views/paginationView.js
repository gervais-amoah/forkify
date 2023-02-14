import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevBtn = `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="./dist/assets/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    const nextBtn = `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="./dist/assets/img/icons.svg#icon-arrow-right"></use>
        </svg>
      </button>`;

    // Page 1 and there are others Pages
    if (curPage == 1 && numPages > 1) {
      return nextBtn;
    }

    // Page 1 but no other Page
    if (curPage == numPages && numPages == 1) {
      return '';
    }

    // Last Page
    if (curPage == numPages) {
      return prevBtn;
    }

    // Other Page
    if (curPage < numPages) {
      return prevBtn + nextBtn;
    }
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', evt => {
      const btn = evt.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
