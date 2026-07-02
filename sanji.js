const rosterUrl = "https://jsonplaceholder.typicode.com/users?_limit=10";
// Fake API to fetch 10 random providers

const clockUrl = "https://worldtimeapi.org/api/timezone/Asia/Kolkata";
// Real time API to sync with internet clock (IST)

const providerSelect = document.getElementById("providerSelect");
const dateInput = document.getElementById("dateInput");
const loadSlotsBtn = document.getElementById("loadSlotsBtn");
const refreshBtn = document.getElementById("refreshBtn");
const slotsGrid = document.getElementById("slotsGrid");
const slotsHeadline = document.getElementById("slotsHeadline");
const slotMeta = document.getElementById("slotMeta");
const bookingsList = document.getElementById("bookingsList");
const clearBookingsBtn = document.getElementById("clearBookingsBtn");
const statProviders = document.getElementById("statProviders");
const statBookings = document.getElementById("statBookings");
const statClock = document.getElementById("statClock");
const lastSync = document.getElementById("lastSync");


const confirmModal = new bootstrap.Modal (document.getElementById("confirmModal"));
const confirmTitle = document.getElementById("confirmTitle");
const notesInput = document.getElementById("notesInput");
const confirmBtn = document.getElementById("confirmBtn");


const state = {
    providers: [],
    nowUtc: null,
    target: null,
    bookings: [],
    pendingSlot: null,
};

function saveBookings() {
    localStorage.setItem("quick-slots",JSON.stringify(state.bookings));
    statBookings.textContent = state.bookings.length;
}

function readBookings() {
    state.bookings = JSON.parse(localStorage.getItem("quick-slots") || "[]");
}

async function fetchProviders() {
    providerSelect.Disabled = true;
    providerSelect.innerHTML = `<option>Loading roaster...</option>`;

    try {
        const res = await fetch(rosterUrl)
        const data = await res.json();

        state.providers = data.map((person) => ({
            id: person.id,
            name: person.name,
            specialty: person.company?.bs || "General",
            city: person.address?.city  || "remote",
          
        }));
        statProviders.textContent = state.providers.length;
        renderProviderSelect();
    } catch (err) {
        console.error("Error fetching providers:", err);
        providerSelect.innerHTML = `<option>Error loading name...</option>`;
        console.log(err);
    } 
};