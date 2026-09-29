// Total number of parking slots
const TOTAL_SLOTS = 20;


// Get HTML elements
const bookingForm = document.getElementById("bookingForm");
const nameInput = document.getElementById("name");
const vehicleInput = document.getElementById("vehicle");
const slotSelect = document.getElementById("slot");

const slotContainer = document.getElementById("slotContainer");

const totalSlots = document.getElementById("totalSlots");
const availableSlots = document.getElementById("availableSlots");
const occupiedSlots = document.getElementById("occupiedSlots");


// Load parking data from localStorage
let parkingData =
    JSON.parse(localStorage.getItem("parkingData")) || {};


// Create parking slots
function createSlots() {

    slotContainer.innerHTML = "";
    slotSelect.innerHTML =
        '<option value="">Select Slot</option>';


    for (let i = 1; i <= TOTAL_SLOTS; i++) {

        const slotNumber = "P" + i;

        const slot = document.createElement("div");

        slot.classList.add("slot");


        // Check whether slot is booked
        if (parkingData[slotNumber]) {

            slot.classList.add("booked");

            slot.innerHTML = `
                <h3>${slotNumber}</h3>

                <p>
                    🚗 ${parkingData[slotNumber].vehicle}
                </p>

                <p>
                    👤 ${parkingData[slotNumber].name}
                </p>

                <button
                    onclick="releaseSlot('${slotNumber}')">
                    Release
                </button>
            `;

        } else {

            slot.classList.add("available");

            slot.innerHTML = `
                <h3>${slotNumber}</h3>

                <p>Available</p>
            `;


            // Add available slot to dropdown
            const option = document.createElement("option");

            option.value = slotNumber;
            option.textContent = slotNumber;

            slotSelect.appendChild(option);
        }


        slotContainer.appendChild(slot);
    }


    updateDashboard();
}


// Book parking slot
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name = nameInput.value.trim();
    const vehicle = vehicleInput.value.trim();
    const selectedSlot = slotSelect.value;


    // Validation
    if (name === "" ||
        vehicle === "" ||
        selectedSlot === "") {

        alert("Please fill all fields.");

        return;
    }


    // Check if slot is already booked
    if (parkingData[selectedSlot]) {

        alert("This parking slot is already booked.");

        return;
    }


    // Save booking
    parkingData[selectedSlot] = {

        name: name,

        vehicle: vehicle.toUpperCase(),

        bookingTime: new Date().toLocaleString()

    };


    // Save to browser
    localStorage.setItem(
        "parkingData",
        JSON.stringify(parkingData)
    );


    alert(
        "Parking slot " +
        selectedSlot +
        " booked successfully!"
    );


    // Reset form
    bookingForm.reset();


    // Refresh slots
    createSlots();

});


// Release parking slot
function releaseSlot(slotNumber) {

    const confirmRelease = confirm(
        "Are you sure you want to release " +
        slotNumber +
        "?"
    );


    if (!confirmRelease) {
        return;
    }


    // Remove booking
    delete parkingData[slotNumber];


    // Update localStorage
    localStorage.setItem(
        "parkingData",
        JSON.stringify(parkingData)
    );


    alert(
        "Parking slot " +
        slotNumber +
        " has been released."
    );


    // Refresh slots
    createSlots();
}


// Update dashboard
function updateDashboard() {

    const occupied =
        Object.keys(parkingData).length;

    const available =
        TOTAL_SLOTS - occupied;


    totalSlots.textContent =
        TOTAL_SLOTS;

    availableSlots.textContent =
        available;

    occupiedSlots.textContent =
        occupied;
}


// Load website
createSlots();