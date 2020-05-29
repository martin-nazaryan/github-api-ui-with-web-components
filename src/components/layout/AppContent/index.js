"use strict"

;(() => {
  class AppContent extends HTMLElement {
    get searchElemHTML() {
      return App.hash.route !== 'user' ? '<search-element id="search"></search-element>' : '';
    }

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      this.shadowRoot.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        ${this.searchElemHTML}
        <${App.hash.route}-route ></${App.hash.route}-route>
      `;
    }

    connectedCallback() {
      window.addEventListener('hashchange', () => this.render());
      this.render();
    }
  }

  customElements.define('app-content', AppContent);
})();
