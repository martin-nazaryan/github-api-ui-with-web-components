"use strict"

;(() => {
  class SearchElement extends HTMLElement {
    render() {
      const shadow = this.attachShadow({mode: 'open'});
      const placeholder = this.getAttribute('placeholder') || '';

      shadow.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        <input class="search" placeholder="Search ${placeholder}"/>
      `;
    }

    connectedCallback() {
      this.render();
      this.shadowRoot.querySelector("input").focus();
      this.shadowRoot.querySelector('input').onkeyup = (e) => {
        if(e.target.value === '' || e.keyCode !== 13) return;
        this.search(e);
      }
    }

    search(e) {
      document.dispatchEvent(new CustomEvent('gitSearch', {detail: e.target.value}));
    }
  }

  customElements.define('search-element', SearchElement);
})();
