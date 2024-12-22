const apiKey = "AIzaSyDnmHgc2j4s6GeTMLCJcpmnFgUjdm64zIo";
const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const peopleList = document.getElementById("peopleList");
const generateButton = document.getElementById("generatePeople");
const localStorageKey = "personData";

// API'den kişi bilgisi al
async function fetchPersonData() {
  const prompt = `
sen artık bana yardıma ihtiyacı olan bir kişi oluştur ve onun hakkında bir hikaye ver. 
  bunlar bana eskiden verdiklerin. Bunlardan biri olmasin. 
  {fullName: kişinin ismi, age:kişinin yaşı, location:kişinin yeri, occupation:kişinin meslegi, requiredAmount:kişinin ihtiyacı olan para miktarı}

  Sadece bunu dön başka hiçbir şey ekleme.
`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const d = await response.json();
    const jsonText = d.candidates[0].content.parts[0].text;
    console.log(jsonText.replaceAll("```json", "").replaceAll("`", "").trim());
    const person = JSON.parse(
      jsonText.replaceAll("```json", "").replaceAll("`", "").trim()
    );
    saveToLocalStorage(person);
    return person;
  } catch (error) {
    console.error("Error fetching person data:", error);
    throw new Error("Failed to generate person data");
  }
}

// Kişi kartını oluştur
function createPersonCard(person) {
  return `
    <div class="container col-md-12 mx-auto">
      <div class="card">
        <div class="card-body p-5">
          <h3 class="card-title text-center mb-4">${person.fullName}</h3>
          <div class="row align-items-center g-4">
            <div class="col-md-3">
              <p class="card-text mb-0">
                <strong>Age:</strong> ${person.age}<br>
                <strong>Location:</strong> ${person.location}
              </p>
            </div>
            <div class="col-md-3">
              <p class="card-text mb-3">
                <strong>Occupation:</strong> ${person.occupation}<br>
                <strong>Required Amount:</strong> <span class="text-success fw-bold">$${person.requiredAmount}</span>
              </p>
              <button class="btn btn-success" onclick="window.location.href='donate.html'">Donate Now</button>
            </div>
            <div class="col-md-6">
              <div class="story-container">
                <h6 class="mb-2">Story</h6>
                <p class="card-text story-text">${person.story}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// LocalStorage'a kaydet
function saveToLocalStorage(person) {
  localStorage.setItem(localStorageKey, JSON.stringify(person));
}

// LocalStorage'dan oku
function getFromLocalStorage() {
  const savedPerson = localStorage.getItem(localStorageKey);
  return savedPerson ? JSON.parse(savedPerson) : null;
}

// Ana fonksiyon
async function generatePeopleInNeed() {
  try {
    let person = getFromLocalStorage();
    if (!person) {
      person = await fetchPersonData();
    }
    peopleList.innerHTML = createPersonCard(person);
  } catch (error) {
    peopleList.innerHTML = `
      <div class="col-10 text-center">
        <p class="text-danger">Error: ${error.message}</p>
        <p>Please try again</p>
      </div>
    `;
  }
}

// Event listeners
generateButton.addEventListener("click", async () => {
  localStorage.removeItem(localStorageKey); // Yeni bir kişi oluşturmak için mevcut kişiyi temizle
  await generatePeopleInNeed();
});

// İlk yüklemede kişi göster
generatePeopleInNeed();
