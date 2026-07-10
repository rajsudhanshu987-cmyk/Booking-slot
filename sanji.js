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
}

function renderProviderSelect() {
    providerSelect.Disabled = false;
    providerSelect.innerHTML = `<option value ="">Select a provider</option>`;

    state.providers.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.name} (${p.specialty})`;
        providerSelect.appendChild(opt);
    });
}

async function syncClock() {
    try {
        const res = await fetch(clockUrl);
        const data = await res.json();
        state.nowUtc = new Date(data.utc_datetime);
        statClock.textContent = state.nowUtc.toLocaleTimeString("en-IN", { 
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
         });
         lastSync.textContent = `Last synced ${new Date().toLocaleTimeString("en-IN"
         )}`; 
        } catch (err) {
            console.warn("Clock sync failed, falling back to client time", err);
            state.nowUtc = new Date();
            statClock.textContent = state.nowUtc.toLocaleTimeString("en-IN");
            lastSync.textContent = `Fallback to client ${new Date().toLocaleTimeString(
                "en-IN"
            )}`;
        }
    }

    function setMinDate() {
        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
        dateInput.value = today;
    }


    function buildSlots(date) {
        const slots = [];

        for (let hour = 9; hour <= 17; hour++) {
            ["00", "30"].forEach((minute) => {
                const label = `${String(hour).padStart(2, "0")}:${minute}`;
                slots.push(label);
            });
    }
    return slots.map((label) => ({
        label,
        disabled: isSlotDisabled(date, label),
    }));
}

function isSlotDisabled() {
    const targetDate = new Date(`${date}T${slotLabel}:00+05:30`);
    const now = state.nowUtc || new Date();

    if (targetDate < now) {
        return true;
    }
    const alreadyBooked = state.bookings.some(item ) 
    => {
        item.date === date && 
        item.slot === slotLabel &&
        item.providerId === state.target?.providersId;
    });
    return alreadyBooked;
}