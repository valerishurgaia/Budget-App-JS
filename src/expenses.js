const datas = document.getElementById("datas");
const form = document.getElementById("form");

// Function for get users array from local storage
const readexpenses = (key) => {
  const exisiting_expenses = localStorage.getItem(key);
  if (exisiting_expenses === null) {
    return [];
  } else {
    return JSON.parse(exisiting_expenses);
  }
};
const userArray = readexpenses("expenses");

//function for render array which is filtered or not;
function renderUsers(arr) {
  datas.innerHTML = "";
  arr.forEach((element) => {
    const user = document.createElement("div");

    function incOrExp(textColor, borderColor, text) {
      user.classList.add("border", "px-1", `${borderColor}`, "income");
      user.setAttribute("id", `${element.id}`);
      user.innerHTML = `
        <div class='d-flex justify-content-between m-2' id= '${element.id}'>
          <p class="m-0">თარიღი: ${element.date}</p>
          <button type='button' class='border-0 bg-white btn-close delButton'></button>
        </div>
        <p class="m-2">კატეგორია: ${element.category}</p>
        <p class="m-2">თანხა: ${element.amount}$</p>
        <div class='d-flex justify-content-between m-2'>
          <p class="m-0 ${textColor}">${text}</p>
          <button type='button' class='border-0 bg-white text-primary editButton'>რედაქტირება</div>
        </div>`;
    }

    if (element.type === "income") {
      incOrExp("text-success-emphasis", "border-success-subtle", "შემოსავალი");
    }

    if (element.type === "expense") {
      incOrExp("text-danger-emphasis", "border-danger-subtle", "გასავალი");
    }
    datas.append(user);
    itemButtons("delButton", userArray);
    itemButtons("editButton", userArray);
  });
}
renderUsers(userArray);
// Function for filter array
function filteredData(originalArr, date, category, min, max) {
  let filteredArr = originalArr;

  function filterBy(filterBy, arr) {
    return arr.filter(
      (element) =>
        form[filterBy].value === "" ||
        element[filterBy] === form[filterBy].value
    );
  }

  function filterMinMax(min, max, filteredArr) {
    return filteredArr.filter((element) => {
      const amount = parseFloat(element.amount);
      return (
        (min === "" || amount >= parseFloat(min)) &&
        (max === "" || amount <= parseFloat(max))
      );
    });
  }

  if (date !== "") {
    filteredArr = filterBy("date", filteredArr);
  }
  if (category !== "") {
    filteredArr = filterBy("category", filteredArr);
  }
  if (min !== "" || max !== "") {
    filteredArr = filterMinMax(min, max, filteredArr);
  }
  return filteredArr;
}

function filterRender() {
  const localArray = readexpenses("expenses");

  const date = form.date.value;
  const category = form.category.value;
  const min = form.min.value;
  const max = form.max.value;

  const filtered = filteredData(localArray, date, category, min, max);
  renderTotal(filtered);
  renderUsers(filtered);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  filterRender();
});

//Fuctions for total expenses and incomes
function forTotal(type, arr) {
  return arr.filter((element) => element.type === type);
}

function reduce(arr) {
  return arr.reduce((acc, cur) => {
    let result = (acc += +cur.amount);

    return result;
  }, 0);
}

function renderTotal(arr) {
  const total = document.getElementById("total");
  const incomes = forTotal("income", arr);
  const expense = forTotal("expense", arr);

  const sumInc = reduce(incomes);
  const sumExp = reduce(expense);

  total.innerHTML = `
  <p class="m-2">შემოსავალი:<span class='ps-2 text-success-emphasis'>
  ${sumInc}$</span></p>
  <p class="m-2">გასავალი:<span class='ps-4 text-danger-emphasis'>
  ${sumExp}$</span></p>
  `;
}
renderTotal(userArray);

function itemButtons(buttonName, array) {
  const button = document.querySelectorAll("." + buttonName);

  button.forEach((element) => {
    element.addEventListener("click", (e) => {
      const userId = +e.target.parentNode.parentNode.id;

      if (buttonName === "delButton") {
        removeItem(userId, array);
      }
      if (buttonName === "editButton") {
        editUser(userId, array);
      }
    });
  });
}

function removeItem(id, array) {
  const filteredArr = array.filter((element) => element.id !== id);
  const index = array.findIndex((item) => item.id === id);

  if (index !== -1) {
    array.splice(index, 1);
  }
  localStorage.setItem("expenses", JSON.stringify(filteredArr));

  filterRender();
}

function editUser(id) {
  const url = `/form.html?id=${id}`;
  window.location.href = url;
}
