$(document).ready(function() {
    // Get current date
    const currentDate = new Date();

    // Initialize date picker
    const datePicker = $('.date-picker');
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const button = $('<button>').text(dateString).data('date', date.toISOString());
        if (date < currentDate) {
            button.addClass('disabled');
        }
        datePicker.append(button);
    }

    // Initialize session list
    const sessionList = $('.session-list');
    const sessions = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    sessions.forEach(session => {
        const button = $('<button>').text(session).data('session', session);
        sessionList.append(button);
    });

    // Initialize seat layout
    const seatLayout = $('.seat-layout');
    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const seatButton = $('<button>').text(`${String.fromCharCode(64 + row)}${col}`).data('seat', `${String.fromCharCode(64 + row)}${col}`);
            seatLayout.append(seatButton);
        }
    }

    // Handle date selection
    datePicker.on('click', 'button', function() {
        const selectedDate = $(this).data('date');
        datePicker.find('button').removeClass('selected');
        $(this).addClass('selected');
        updateSessionList(selectedDate);
    });

    // Handle session selection
    sessionList.on('click', 'button', function() {
        const selectedSession = $(this).data('session');
        sessionList.find('button').removeClass('selected');
        $(this).addClass('selected');
        updateSeatLayout(selectedSession);
    });

    // Handle seat selection
    seatLayout.on('click', 'button', function() {
        const selectedSeat = $(this).data('seat');
        $(this).toggleClass('selected');
    });

    // Update session list based on selected date
    function updateSessionList(selectedDate) {
        sessionList.find('button').removeClass('disabled');
        const selectedDateObj = new Date(selectedDate);
        const currentTimeObj = new Date();
        if (selectedDateObj.toDateString() === currentTimeObj.toDateString() && selectedDateObj.getTime() <= currentTimeObj.getTime()) {
            sessionList.find('button').each(function() {
                const sessionTime = new Date(`${selectedDateObj.toDateString()} ${$(this).data('session')}`);
                if (sessionTime.getTime() <= currentTimeObj.getTime()) {
                    $(this).addClass('disabled');
                }
            });
        }
    }
    // Booking button click event
    $('.booking-button').on('click', function() {
        // Get selected date, session, and seats
        const selectedDate = datePicker.find('.selected').data('date');
        const selectedSession = sessionList.find('.selected').data('session');
        const selectedSeats = seatLayout.find('.selected').map(function() {
            return $(this).data('seat');
        }).get();

        // Save booking data to localStorage
        const bookingData = {
            date: selectedDate,
            session: selectedSession,
            seats: selectedSeats
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Display confirmation message or redirect to a confirmation page
        alert(`Booking confirmed! \nDate: ${selectedDate}\nSession: ${selectedSession}\nSeats: ${selectedSeats.join(', ')}`);
    });

    // Load booking data from localStorage on page load
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (bookingData) {
        // Update the UI with the saved booking data
        datePicker.find(`button[data-date="${bookingData.date}"]`).addClass('selected');
        updateSessionList(bookingData.date);
        sessionList.find(`button[data-session="${bookingData.session}"]`).addClass('selected');
        updateSeatLayout(bookingData.session);
        bookingData.seats.forEach(seat => {
            seatLayout.find(`button[data-seat="${seat}"]`).addClass('selected booked');
        });
    }


    // Update seat layout based on selected session
    function updateSeatLayout(selectedSession) {
        seatLayout.find('button').removeClass('disabled');
        // Here, you can implement the logic to load the seat availability data for the selected session
        // and update the seat layout accordingly
    }
});