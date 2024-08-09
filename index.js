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

// Function to format metric values with commas
function formatMetricValue(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'M'; // Format in millions
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'K'; // Format in thousands
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Return as is for smaller values
}

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

// Initialize metrics
function init() {
    fetch('https://script.google.com/macros/s/AKfycbyieqqDydzF4d08qCaqx0J2EPBaOjrSWMtnquEb-y4EE8h4S7UA9dvNO6LALi1_37pw/exec')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const metrics = data.metrics;

            // Clear skeletons
            document.querySelectorAll('.skeleton.metric').forEach(skeleton => skeleton.remove());
            const firstAnalyticsSection = document.getElementById('firstAnalyticsSection');
            const secondAnalyticsSection = document.getElementById('secondAnalyticsSection');

            // Populate analytics section with metrics
            for (let i = 0; i < 6; i++) {
                const metric = metrics[i];
                firstAnalyticsSection.innerHTML += createMetricElement(metric.name, metric.value, metric.percentage);
            }

            for (let i = 6; i < metrics.length; i++) {
                const metric = metrics[i];
                secondAnalyticsSection.innerHTML += createMetricElement(metric.name, metric.value, metric.percentage);
            }

            updateProgressBars(metrics);
        })
        .catch(error => console.error('Error:', error));
}

// Update progress bars
function updateProgressBars(metrics) {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach((circle, index) => {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        const percentage = metrics[index]?.percentage || 0;
        const offset = circumference - (parseFloat(percentage) / 100 * circumference);
        circle.style.strokeDashoffset = offset;

        // Set color based on percentage
        if (percentage >= 80) {
            circle.style.stroke = '#1B9C85'; // Green
        } else if (percentage >= 50) {
            circle.style.stroke = '#F7D060'; // Yellow
        } else {
            circle.style.stroke = '#FF0060'; // Red
        }
    });
}

// Create metric element with formatted value
function createMetricElement(label, value, percentage) {
    const formattedValue = formatMetricValue(value); // Format the metric value
    return `
        <div class="metric">
            <div class="status">
                <div class="info">
                    <h3>${label}</h3>
                    <h1 class="value">${formattedValue}</h1> <!-- Use formatted value -->
                </div>
                <div class="progresss">
                    <svg width="76" height="76">
                        <circle class="progress-circle" cx="38" cy="38" r="36"></circle>
                    </svg>
                    <div class="percentage">
                        <p>${percentage}%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
