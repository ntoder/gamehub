let mywebsite = document.getElementById("my-website");

function checkPassword() {
  let password = prompt("Please enter your password:");

  // User cancelled the prompt
  if (password === null) return;

  if (password === "1234") {
    mywebsite.style.display = "block";
    alert("Welcome back! You have successfully logged in. Enjoy your stay.");
  } else {
    alert("Wrong password. Please try again.");
    checkPassword(); // Re-prompt on wrong password
  }
}

checkPassword();