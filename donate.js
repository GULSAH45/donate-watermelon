const user = JSON.parse(localStorage.getItem("users"));

// UI elementlerini seç
const userNameEl = document.getElementById("userName");
const donationCreditEl = document.getElementById("donationCredit");
const amountInput = document.getElementById("amount");
const sendButton = document.querySelector(".btn-success");

// Kullanıcı bilgilerini göster
userNameEl.textContent = `Hello ${user.name} `;
donationCreditEl.textContent = `${user.credits}$`;

// Bağış işlemi
sendButton.addEventListener("click", () => {
  const amount = parseInt(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (amount > user.credits) {
    alert("Insufficient credits");
    return;
  }

  // Bağışı gerçekleştir
  user.credits -= amount;
  localStorage.setItem("users", JSON.stringify(user));
  alert("Donation successful!");

  // Formu temizle ve sayfayı yenile
  amountInput.value = "";
  location.reload();
});
