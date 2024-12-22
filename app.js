const users = {
  "gulsah@gmail.com": {
    name: "gulsah",
    password: "123456",
    credits: "1500",
    Iban: "TR1234567890",
  },
  "seyma@gmail.com": {
    name: "seyma",
    password: "678910",
    credits: "1600",
    Iban: "TR1234567890",
  },
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorText = document.getElementById("errorText");

  if (users[email]) {
    if (users[email].password === password) {
      successText.textContent = "Login successful";
      successText.style.display = "block";

      localStorage.setItem(
        "users",
        JSON.stringify({
          email,
          name: users[email].name,
          credits: users[email].credits,
        })
      );
      window.location.href = "donate.html";
    } else {
      successText.textContent = "password is wrong";
      successText.style.display = "block";
      successText.style.color = "red";
    }
  } else {
    errorText.textContent = "not found";
    errorText.style.display = "block";
  }
});
