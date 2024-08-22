export class PopupManager {
  /**
   * @constructor
   * @param {string} query - Query to pass to querySelector
   */
  constructor(query, btnQuery) {
    this.popup = document.querySelector(query);
    this.openBtn = document.querySelector(btnQuery);
    this.searchText = "";
    this.callbacks = [];
    this.entries = [];
  }

  /**
   * @param {Function | Function[]} callbacks - callbacks to call
   */
  setup(callbacks) {
    this.callbacks = callbacks;
    return this;
  }

  init() {
    this.popup.querySelector(".symsearch__header-close").addEventListener('click', () => this.disable());
    this.openBtn.addEventListener('click', () => this.enable());
    this.popup.addEventListener('click', (e) => {
      if (!e.target.closest(".symsearch")) {
        this.disable();
      }
    })

    const variants = this.popup.querySelectorAll(".symsearch__variant");
    variants.forEach((variant) => {
      const variantText = variant.querySelector(".symsearch__variant-text > p").innerHTML.toLowerCase();
      this.entries.push({
        element: variant,
        text: variantText,
      });
      
      variant.addEventListener('click', () => {
        if (typeof this.callbacks === 'function') {
          this.callbacks(variantText);
        } else {
          this.callbacks.forEach((callback) => callback(variantText));
        }
        this.disable();
      })
    })

    const input = this.popup.querySelector(".symsearch__searchbar > input");
    input.addEventListener('input', (e) => {
      const lCaseVal = e.target.value.toLowerCase();
      this.entries.forEach((entry) => {
        const isValid = entry.text.toLowerCase().includes(lCaseVal);
        entry.element.classList
          .toggle("symsearch__variant-hidden", !isValid);
      }) 
    })
  }

  // Утилити-методы

  enable() {
    this.popup.classList.remove("swrapper-hidden");
  }

  disable() {
    this.popup.classList.add("swrapper-hidden");
  }
}
