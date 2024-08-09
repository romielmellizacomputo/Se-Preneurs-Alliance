const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const darkMode = document.querySelector('.dark-mode');

// Event listener for opening the side menu
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

// Event listener for closing the side menu
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

// Event listener for toggling dark mode
darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
});

// Function to populate orders table
function populateOrders(orders) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear existing content

    orders.forEach(order => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${order.productName}</td>
            <td>${order.productNumber}</td>
            <td>${order.paymentStatus}</td>
            <td class="${getStatusClass(order.status)}">${order.status}</td>
            <td class="primary">Details</td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
}

// Helper function to determine status class
function getStatusClass(status) {
    switch (status) {
        case 'Declined':
            return 'danger';
        case 'Pending':
            return 'warning';
        default:
            return 'primary';
    }
}

// Load page function
async function loadPage(page) {
    try {
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        document.getElementById('main-content').innerHTML = content;

        // Call init if the loaded page is the dashboard
        if (page === 'dashboard') {
            init(); // Ensure the dashboard initializes properly
        }
    } catch (error) {
        console.error('Error loading page:', error);
        alert('Error loading page: ' + error.message); // Notify user of the error
    }
}

// Example usage of populateOrders function (assuming Orders is defined)
populateOrders(Orders);

// Initialize the dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPage('dashboard'); // Load the default dashboard page
});
