const form = document.getElementById("form");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

const expenseArray = ["დარბაზი", "შოპინგი", "ოჯახი", "სხვა"];
const incomeArray = ["ხელფასი", "ინვოისი", "სხვა"];

const incOrExpSelect = (arr) => {
  form["category"].innerHTML = arr.map(
    (element) => `<option value="${element}">${element}</option> `
  );
};

income.addEventListener("change", () => incOrExpSelect(incomeArray));
expense.addEventListener("change", () => incOrExpSelect(expenseArray));

editId ? editUser() : addUser();

function addUser() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputs(form["date"]);
    validateInputs(form.children[1]); // incOrExp div
    validateInputs(form["category"]);
    validateInputs(form["amount"]);

    if (form.querySelectorAll(".error").length === 0) {
      const userExpense = {
        id: generateId("expenses"),
        date: form["date"].value,
        type: form["incOrExp"].value,
        category: form["category"].value,
        amount: parseFloat(form["amount"].value)
      };

      saveUsers(userExpense, "expenses");
      sucsess("წარმატებით დაემატა!");
    }
  });
}

const sucsess = (sucessText, action) => {
  form.reset();
  form["category"].innerHTML = "";

  const newElement = document.createElement("p");
  newElement.classList.add("text-success-emphasis", "sucsess");
  newElement.textContent = sucessText;

  form.insertAdjacentElement("afterend", newElement);

  if (action === "link") {
    setTimeout(() => {
      newElement.remove();
      window.location.href = "./expenses.html";
    }, 1000);
  } else {
    setTimeout(() => {
      newElement.remove();
    }, 3000);
  }
};

function validateInputs(element) {
  if (element.value === "" || form["incOrExp"].value === "") {
    element.classList.add("error");
    form.classList.add("border-danger");
    setTimeout(() => {
      form.classList.remove("border-danger");
    }, 2000);
  } else {
    element.classList.remove("error");
  }
}

const saveUsers = (user, key) => {
  const saved_userArr = localStorage.getItem(key);

  if (saved_userArr === null) {
    const expenses = [user];
    localStorage.setItem(key, JSON.stringify(expenses));
  } else {
    const expenses_parsed = JSON.parse(saved_userArr);
    expenses_parsed.push(user);
    localStorage.setItem(key, JSON.stringify(expenses_parsed));
  }
};

function generateId(key) {
  const savedexpenses = localStorage.getItem(key);
  const parsedexpenses = JSON.parse(savedexpenses);

  let nextId = 1;
  if (savedexpenses && parsedexpenses.length > 0) {
    const lastItem = parsedexpenses[parsedexpenses.length - 1];
    nextId = lastItem.id + 1;
  }

  return nextId;
}

function editById() {
  const savedexpenses = localStorage.getItem("expenses");
  const parsedexpenses = JSON.parse(savedexpenses);

  if (editId && parsedexpenses !== null && parsedexpenses.length > 0) {
    const idMatch = parsedexpenses.find((element) => element.id === +editId);

    form["date"].value = idMatch["date"];
    form["incOrExp"].value = idMatch["type"]; // Inc or Exp div
    if (form["incOrExp"].value === "income") {
      incOrExpSelect(incomeArray);
      form["category"].value = idMatch["category"];
    } else {
      incOrExpSelect(expenseArray);
      form["category"].value = idMatch["category"];
    }
    form["amount"].value = idMatch["amount"];
  }
}
window.addEventListener("load", editById());

function editUser() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const savedexpenses = localStorage.getItem("expenses");
    const parsedexpenses = JSON.parse(savedexpenses);

    parsedexpenses.map((element) => {
      if (element.id === +editId) {
        element.date = form["date"].value;
        element.type = form["incOrExp"].value;
        element.category = form["category"].value;
        element.amount = +form["amount"].value;
        element.date = form["date"].value;
      }
    });
    validateInputs(form["date"]);
    validateInputs(form.children[1]); // incOrExp div
    validateInputs(form["category"]);
    validateInputs(form["amount"]);

    if (form.querySelectorAll(".error").length === 0) {
      localStorage.setItem("expenses", JSON.stringify(parsedexpenses));
      sucsess("წარმატებით შეიცვალა!", "link");
    }
  });
}
