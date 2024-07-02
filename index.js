const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2405-CPU-RM-WEB-PT/events";
const eventList = document.querySelector("#events");
const state = {
  events: [],
};

// Get API data and display
async function render() {
  await getApiData();
  printResults();
}

// Get API Data. Send to global storage in state object.
async function getApiData() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.log(error.message);
  }
}

// Display event list
function printResults() {
  // If event list has no data, stop and show msg.
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events. Loser.</li>";
    return;
  }
  // Loop through events array. Create il for each event. Give content. Return all ils to eventLog to replace eventlist children.
  const eventLog = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>Name: ${event.name}</h2>
       </p>ID: ${event.id}, Date: ${event.date}, Location: ${event.location}, CohortID: ${event.cohortId} </p>
      <p>Description: ${event.description}</p>`;
    const removeButton = document.createElement("button");
    // removeButton.setAttribute("id", "removeme");
    removeButton.textContent = "Remove Button";

    removeButton.addEventListener("click", function () {
      const response = fetch(`${API_URL}/${event.id}`, { method: "DELETE" });
      render();
    });
    li.appendChild(removeButton);
    return li;
  });

  eventList.replaceChildren(...eventLog);
}

// Add event listeners for adding/removing event
const formSubmit = document.querySelector("#form");
formSubmit.addEventListener("submit", addEvent);

// Add event via form
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: formSubmit.name.value,
        date: new Date(formSubmit.date.value).toISOString(),
        location: formSubmit.location.value,
        description: formSubmit.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

// Remove Event
async function removeEvent(event) {
  event.preventDefault();
  const removemeref = document.getElementById("removeme");
  try {
    const response = await fetch(`${API_URL}/${removemeref.id}`, {
      method: "DELETE",
    });
    render();
  } catch (error) {
    console.error(error);
  }
}

render();
