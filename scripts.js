document.addEventListener('DOMContentLoaded', function () {
    const reservationForm = document.getElementById('reservation-form');

    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const date = document.getElementById('date').value;
            const travelClass = document.getElementById('class').value;
            const mealOption = document.getElementById('meal').value;

            // Generate train name and number based on boarding and destination stations
            const trainName = generateTrainName(from, to);
            const trainNumber = generateTrainNumber();

            // Extract passenger names
            const passengerNames = [];
            for (let i = 1; i <= 5; i++) {
                const name = document.querySelector(`input[name="passengerName${i}"]`).value;
                if (name.trim() !== '') {
                    passengerNames.push(name);
                }
            }

            const totalCost = calculateTotalCost(travelClass, mealOption, passengerNames.length);

            const pnr = 'PNR' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            
            const reservationDetails = {
                from: from,
                to: to,
                date: date,
                class: travelClass,
                meal: mealOption,
                passengers: passengerNames,
                train: { name: trainName, number: trainNumber },
                pnr: pnr,
                totalCost: totalCost // Include total cost in reservation details
            };

            localStorage.setItem('reservationDetails', JSON.stringify(reservationDetails));
            window.location.href = 'confirmation.html';
        });
    }

    const confirmationDetailsDiv = document.getElementById('confirmation-details');
    if (confirmationDetailsDiv) {
        const reservationDetails = JSON.parse(localStorage.getItem('reservationDetails'));
        if (reservationDetails) {
            confirmationDetailsDiv.innerHTML = `
                <p><strong>From:</strong> ${reservationDetails.from}</p>
                <p><strong>To:</strong> ${reservationDetails.to}</p>
                <p><strong>Date:</strong> ${reservationDetails.date}</p>
                <p><strong>Class:</strong> ${reservationDetails.class}</p>
                <p><strong>Meal:</strong> ${reservationDetails.meal}</p>
                <p><strong>Train:</strong> ${reservationDetails.train.name} (${reservationDetails.train.number})</p>
                <p><strong>Passengers:</strong> ${reservationDetails.passengers.join(', ')}</p>
                <p><strong>Total Cost:</strong> $${reservationDetails.totalCost}</p> <!-- Display total cost -->
            `;
        }
    }

    showPassengerForm();

    function calculateTotalCost(travelClass, mealOption, numPassengers) {
        let costPerPassenger;
        switch (travelClass) {
            case 'economy':
                costPerPassenger = 800;
                break;
            case 'business':
                costPerPassenger = 1200;
                break;
            case 'first':
                costPerPassenger = 1000;
                break;
            default:
                costPerPassenger = 0;
        }

        let mealCost;
        switch (mealOption) {
            case 'vegetarian':
                mealCost = 300;
                break;
            case 'non-vegetarian':
                mealCost = 400;
                break;
            default:
                mealCost = 0;
        }

        return (costPerPassenger + mealCost) * numPassengers;
    }
});

function generateTrainName(from, to) {
    const fromCode = from.substring(0, 3).toUpperCase();
    const toCode = to.substring(0, 3).toUpperCase();
    return `${fromCode}-${toCode} SF-Express`;
}

function generateTrainNumber() {
    return Math.floor(Math.random() * 1000) + 1000;
}

function showPassengerForm() {
    var classSelect = document.getElementById("class");
    var passengerForm = document.getElementById("passenger-form");
    var passengerTableBody = document.getElementById("passenger-table-body");
    passengerTableBody.innerHTML = "";
    if (classSelect.value === "economy" || classSelect.value === "business" || classSelect.value === "first") {
        passengerForm.style.display = "block";
        for (var i = 1; i <= 5; i++) {
            var newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" class="form-control" name="passengerName${i}" placeholder="Name" ></td>
                <td><input type="number" class="form-control" name="passengerAge${i}" placeholder="Age" ></td>
                <td>
                    <select class="form-control" name="passengerGender${i}">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </td>
            `;
            passengerTableBody.appendChild(newRow);
        }
    } else {
        passengerForm.style.display = "none";
    }
}
