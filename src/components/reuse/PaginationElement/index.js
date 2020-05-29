"use strict"

;(() => {
  class PaginationElement extends HTMLElement {
    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      const page = this.getAttribute('page');
      const total = this.getAttribute('total');

      const prevDisabled = page === "1";
      const nexDisabled = (+total / +page) <= App.PER_PAGE;

      this.shadowRoot.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        <section>
          <button ${prevDisabled ? 'disabled' : ''} class="pagination-button" data-step="-1">⬅️</button>
          <span>${page}</span>
          <button ${nexDisabled ? 'disabled' : ''} class="pagination-button" data-step="1">➡️</button>
          <span class="total-count">from ${Math.ceil(total / App.PER_PAGE)}</span>
        </section>
      `;

      const btnList = [...this.shadowRoot.querySelectorAll('.pagination-button')];
      btnList.forEach(btn => btn.onclick = this.paginate);
    }

    connectedCallback() {
      this.render();
    }

    paginate = (e) => {
      const {step} = e.currentTarget.dataset;
      const currentPage = this.getAttribute('page');
      const page = +currentPage + (+step);
      document.dispatchEvent(new CustomEvent('paginate', {detail: page}));
    }
  }

  customElements.define('pagination-element', PaginationElement);
})();
