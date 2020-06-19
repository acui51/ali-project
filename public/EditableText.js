/* A DOM component that displays text and allows the user to edit it, turning into an input. */
export default class EditableText {
  constructor(id) {
    this.id = id;
    this.name = name;
    this.value = "";
    this.container;
    this.onChange;
    //TODO: Add instance variables, bind event handlers, etc.
    this._createDisplay = this._createDisplay.bind(this);
    this._createInput = this._createInput.bind(this);
  }

  /* Add the component (in display state) to the DOM under parent. When the value changes, onChange
     is called with a reference to this object. */
  addToDOM(parent, onChange) {
    this.container = parent;
    this.onChange = onChange;
    this.container.appendChild(this._createDisplay());
  }

  /* Set the value of the component and switch to display state if necessary. Does not call onChange */
  setValue(value) {
    this.value = value;
    let textBox = document.querySelector("#" + this.id);
    let span = textBox.querySelector("span");
    span.textContent = this.value;
  }

  _createDisplay() {
    let container = document.createElement("div");
    container.id = this.id;
    container.classList.add("editableText");

    let text = document.createElement("span");
    text.textContent = this.name;
    container.appendChild(text);

    let button = document.createElement("button");
    button.type = "button";
    let icon = document.createElement("i");
    icon.classList.add("fas", "fa-pencil-alt");
    button.appendChild(icon);
    button.addEventListener("click", (event) => {
      let newInput = this._createInput();
      this.container.replaceWith(newInput);
      this.container = newInput;
      newInput.focus();
    });

    container.appendChild(button);

    return container;
  }

  _createInput() {
    let input = document.createElement("input");
    input.classList.add("editableInput");
    input.type = "text";
    input.id = this.id;
    input.value = this.value;

    input.addEventListener("blur", (event) => {
      event.preventDefault();
      this.value = input.value;
      let newDisplay = this._createDisplay();
      this.container.replaceWith(newDisplay);
      this.container = newDisplay;
      this.onChange(input);
    });

    return input;
  }
}
