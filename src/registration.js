const form = document.getElementById("form");
const langSelect = document.getElementById("lang");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const telInput = document.getElementById("tel");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const signInLink = document.getElementById("signIp");
const loginButton = document.getElementById("button");

langSelect.addEventListener("change", () => {
  if (langSelect.value === "EN") {
    form.reset();
    form.classList.add("English");
    form.classList.remove("Georgian");
    document.title = "Creat Account";

    document.querySelector("h1").textContent = "Creat Account";
    firstNameInput.placeholder = "First Name";
    lastNameInput.placeholder = "Last Name";
    telInput.placeholder = "Tel";
    emailInput.placeholder = "Email";
    passwordInput.placeholder = "Password";
    confirmPasswordInput.placeholder = "Confirm password";
    loginButton.textContent = "Confirm";
    signInLink.innerHTML =
      "With an existing account - <a href='index.html'>Sign in</a>";
  } else {
    form.reset();
    form.classList.remove("English");
    form.classList.add("Georgian");
    document.title = "Creat Account";

    document.querySelector("h1").textContent = "რეგისტრაცია";
    firstNameInput.placeholder = "სახელი";
    lastNameInput.placeholder = "გვარი";
    telInput.placeholder = "ტელეფონის ნომერი";
    emailInput.placeholder = "ელ-ფოსტა";
    passwordInput.placeholder = "პაროლი";
    confirmPasswordInput.placeholder = "გაიმეორეთ პაროლი";
    loginButton.textContent = "დადასტურება";
    signInLink.innerHTML = "არსებული ანგარიშით <a href='index.html'>შესვლა</a>";
  }
  setSuccess(emailInput);
  setSuccess(passwordInput);
  setSuccess(confirmPasswordInput);
  setSuccess(firstNameInput);
  setSuccess(lastNameInput);
  setSuccess(telInput);
});

const setError = (element) => {
  element.classList.add("border-danger");
  element.classList.add("error");
};

const setSuccess = (element) => {
  element.classList.remove("border-danger");
  element.classList.remove("error");
};

const validatePassword = () => {
  if (
    passwordInput.value.trim() === "" ||
    confirmPasswordInput.value.trim() === ""
  ) {
    setError(passwordInput);
    setError(confirmPasswordInput);
  } else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
    setError(passwordInput);
    setError(confirmPasswordInput);
  } else {
    setSuccess(passwordInput);
    setSuccess(confirmPasswordInput);
  }
};
const validateEmail = () => {
  if (emailInput.value === "") {
    setError(emailInput);
  } else if (
    !emailInput.value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    setError(emailInput);
  } else {
    setSuccess(emailInput);
  }
};

const validateTel = () => {
  if (isNaN(telInput.value.trim()) || telInput.value.trim() === "") {
    setError(telInput);
  } else {
    setSuccess(telInput);
  }
};

const validateNames = (name) => {
  const regex = /^[a-zA-Z]+$/;

  if (!name.value.match(regex)) {
    setError(name);
  } else {
    setSuccess(name);
  }
};

const registerUsers = (user, key) => {
  const savedUserArr = localStorage.getItem(key);

  if (savedUserArr === null) {
    const newUser = [user];
    localStorage.setItem(key, JSON.stringify(newUser));
  } else {
    const parseSavedUser = JSON.parse(savedUserArr);
    parseSavedUser.push(user);
    localStorage.setItem(key, JSON.stringify(parseSavedUser));
  }
};
function generateId(key) {
  const savedexpenses = localStorage.getItem(key);
  const parsedexpenses = JSON.parse(savedexpenses);

  let nextId = 1;
  if (savedexpenses && parsedexpenses.length > 0) {
    const lastItem = parsedexpenses[parsedexpenses.length - 1];
    nextId = lastItem.Id + 1;
  }

  return nextId;
}

const ifAllSuccess = () => {
  if (form.querySelectorAll(".error").length === 0) {
    const newUser = {
      Id: generateId("userArray"),
      Firstname: firstNameInput.value,
      Lastname: lastNameInput.value,
      Tel: `+995${telInput.value}`,
      Email: emailInput.value,
      Password: passwordInput.value
    };
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
    registerUsers(newUser, "userArray");
    form.reset();

    if (!form.classList.contains("Georgian")) {
      document.querySelector("#successText").innerText =
        "You have successfully registered!";
    } else {
      document.querySelector("#successText").innerText =
        "თქვენ წარმატებით დარეგისტრირდით!";
    }
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validatePassword();
  validateEmail();
  validateTel();
  validateNames(firstNameInput);
  validateNames(lastNameInput);

  ifAllSuccess();
});
