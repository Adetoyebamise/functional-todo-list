const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const childDecider = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const container = document.querySelector(".grocery-container");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn")

// edit feature
let editElement;
let editFlag = false;
let editID = "";

// event listener
form.addEventListener("submit", addItems);
clearBtn.addEventListener("click", clearItem);
window.addEventListener("DOMContentLoaded", setUpItems);

// function add Items
function addItems(event) {
  event.preventDefault();
  const itemValue = grocery.value;
  const id = "id" + (new Date()).getTime();
  if (itemValue !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    attr.value = id;
    element.innerHTML = `<p class="title">${itemValue}</p>
      <div class="btn-container">
            <button type="button" class="edit-btn" name="button"><i class="fas fa-edit">Edit</i></button>
            <button type="button" class="delete-btn" name="button"><i class="fas fa-trash">Delete</i></button>
      </div>`;

    // addEventListener to the two button in .btn-container
    const editButton = element.querySelector(".edit-btn");
    editButton.addEventListener("click", editItem);
    const deleteButton = element.querySelector(".delete-btn");
    deleteButton.addEventListener("click", deleteItem);

    // append child element
    childDecider.appendChild(element);
    // displayAlert
    displayAlert("item added to the list", "success");
    //show container
    container.classList.add("show-container");
    // add item to local storage
    addItemToLocalStorage(id, itemValue);
    //set back to default
    setBackToDefault()
  } else if (itemValue !== "" && editFlag) {
    editElement.innerHTML = itemValue;
    displayAlert("value changed", "success");
    // edit local storage
    editItemInLocalStorage(editID, itemValue);
    //set ack to default
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  };
};

//display alert - hoisted
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert message after 1s
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};

// edit item - hoisted
function editItem(event) {
  const element = event.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = event.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  // set submit btn content to edit
  submitBtn.textContent = "edit";
};

// delete item - hoisted
function deleteItem(event) {
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  childDecider.removeChild(element);
  displayAlert("an item removed", "danger");
  if (childDecider.children.length === 0) {
    container.classList.remove("show-container");
    displayAlert("emptyList", "danger");
  }
  // remove item from local storage
  removeFromLocalStorage(id);
  //set back to default
  setBackToDefault();
};

// clear item - hoisted
function clearItem() {
  const items = document.querySelectorAll(".grocery-item");
  console.log(items);
  if (items.length > 0) {
    items.forEach(function (item) {
      childDecider.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  //set ack to default
  setBackToDefault();
  // remove local storage Items " arguement = key"
  localStorage.removeItem('list');
};

// set back to default function - hoisted
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// local storage
// add item to local storage
function addItemToLocalStorage(id, value){
  const grocery = {id, value,};
  let items = getItemFromLocalStorage();
  (items).push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};

// get item from local storage : root function*
function getItemFromLocalStorage(){
  return ((localStorage.getItem("list")) ?
    JSON.parse(localStorage.getItem("list")): []);
}

// remove item from local storage
function removeFromLocalStorage(id){
  let items = getItemFromLocalStorage();
  items = items.filter(function(item){
    if (item.id !== id) {
      return item;
    }
  })
  localStorage.setItem("list", JSON.stringify(items))
}

// edit item in local storage
function editItemInLocalStorage(id, itemValue){
  let items = getItemFromLocalStorage();
  items = items.filter(function (item) {
    if (item.id === id) {
      item.value = itemValue;
    }
    return item;
  })
  localStorage.setItem("list", JSON.stringify(items))
}

// set up items in local local storage
function setUpItems(){
  let items = getItemFromLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value)
    })
  }
  container.classList.add("show-container");
}

// create list Items
function createListItems(id, itemValue){
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    attr.value = id;
    element.innerHTML = `<p class="title">${itemValue}</p>
      <div class="btn-container">
            <button type="button" class="edit-btn" name="button"><i class="fas fa-edit">Edit</i></button>
            <button type="button" class="delete-btn" name="button"><i class="fas fa-trash">Delete</i></button>
      </div>`;

    // addEventListener to the two button in .btn-container
    const editButton = element.querySelector(".edit-btn");
    editButton.addEventListener("click", editItem);
    const deleteButton = element.querySelector(".delete-btn");
    deleteButton.addEventListener("click", deleteItem);

    // append child element
    childDecider.appendChild(element);
}
