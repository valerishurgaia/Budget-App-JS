const form = document.getElementById("form");
const langSelect = document.getElementById("lang");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const recoverLink = document.getElementById("recover");
const loginButton = document.getElementById("button");
const signUpLink = document.getElementById("signUp");
const errorText = document.querySelector(".errorText");

const getUserArr = (key) => {
  const usersArr = localStorage.getItem(key);

  if (usersArr === null) {
    return [];
  } else {
    const parsedUsersArr = JSON.parse(usersArr);
    return parsedUsersArr;
  }
};

langSelect.addEventListener("change", () => {
  if (langSelect.value === "EN") {
    form.reset();
    form.classList.add("English");
    form.classList.remove("Georgian");
    document.title = "Login";

    document.querySelector("h1").textContent = "Login";
    emailInput.placeholder = "Email or Phone Number";
    passwordInput.placeholder = "Password";
    recoverLink.textContent = "Forgot Password?";
    loginButton.textContent = "Login";
    signUpLink.innerHTML =
      "Don't have an account? - <a href='registration.html'>Sign up</a>";
  } else {
    form.reset();

    document.title = "ავტორიზაცია";
    form.classList.add("Georgian");
    form.classList.remove("English");

    document.querySelector("h1").textContent = "ავტორიზაცია";
    emailInput.placeholder = "ელ-ფოსტა | ტელეფონის ნომერი";
    passwordInput.placeholder = "პაროლი";
    recoverLink.textContent = "პაროლის აღდგენა";
    loginButton.textContent = "შესვლა";
    signUpLink.innerHTML =
      "არ გაქვს ანგარიში? - <a href='registration.html'>შექმენი</a>";
  }
  errorText.innerText = "";
  emailInput.classList.remove("border-danger");
  passwordInput.classList.remove("border-danger");
});

const setError = (element, message) => {
  errorText.innerHTML = message;
  errorText.classList.add("text-danger");
  errorText.classList.remove("text-success");
  element.classList.add("border-danger");
  element.classList.add("error");
};

const setSuccess = (element, message) => {
  errorText.innerText = message;
  errorText.classList.add("text-success");
  errorText.classList.remove("text-danger");
  element.classList.remove("border-danger");
  element.classList.remove("error");
};

const findUser = (input, storageKey, inputKey) => {
  const inputValue = input.value;
  const StorageArr = getUserArr(storageKey);

  const ifMatch = StorageArr.find((element) => {
    if (inputKey === "Tel") {
      return element[inputKey] === `+995${inputValue}`;
    } else {
      return element[inputKey] === inputValue;
    }
  });

  return ifMatch;
};

const validateInput = (input, errorMessage, successMessage) => {
  const inputValue = input.value.trim();

  if (inputValue === "") {
    setError(input, errorMessage);
  } else if (
    input === emailInput &&
    !inputValue.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    setError(input, errorMessage);
  }

  if (
    (!findUser(emailInput, "userArray", "Email") ||
      !findUser(emailInput, "userArray", "Tel")) &&
    !findUser(passwordInput, "userArray", "Password")
  ) {
    setError(input, errorMessage);
  } else {
    setSuccess(input, successMessage);
  }
};

const validationByLang = () => {
  if (form.classList.contains("English")) {
    validateInput(emailInput, "User not found", "Welcome!");
    validateInput(passwordInput, "User not found", "Welcome!");
  } else {
    validateInput(emailInput, "მომხმარებელი ვერ მოიძებნა", "მოგესალმებით!");
    validateInput(passwordInput, "მომხმარებელი ვერ მოიძებნა", "მოგესალმებით!");
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validationByLang();
  if (form.querySelectorAll(".error").length === 0) {
    setTimeout(() => {
      window.location.href = "./expenses.html";
    }, 1000);
  }
});
