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
}