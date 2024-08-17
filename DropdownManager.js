export class DropdownManager {
    constructor(dropdownId) {
        this.dropdown = document.querySelector(dropdownId);
        this.callbacks = null;
    }

    /**
     * 
     * @param {Function | Function[]} callback 
     */
    setup(callback) {
        this.callbacks = callback;
        return this;
    }

    init() {
        const selector = this.dropdown.querySelector(".select__selected");
        const menu = this.dropdown.querySelector(".select__menu");
        const options = this.dropdown.querySelectorAll(".select__menu li");
        const selected = this.dropdown.querySelector(".select__selectedtxt");
        selector.addEventListener('click', () => {
            menu.classList.toggle('select__menu-visible');
        })

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
            
                options.forEach(option => {
                    option.classList.remove('select__menu-active');
                })
                option.classList.add('select__menu-active');
                menu.classList.remove('select__menu-visible');

                if (typeof this.callbacks === 'function') {
                    this.callbacks(selected.innerText);
                } else {
                    this.callbacks.forEach(callback => callback(selected.innerText));
                }
            })
        });
    }
}