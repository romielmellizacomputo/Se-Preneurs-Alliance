const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

// Sidebar toggle functionality
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

// Dark mode toggle functionality
darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
});

// Function to render orders
function renderOrders(orders) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    orders.forEach(order => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${order.productName}</td>
            <td>${order.productNumber}</td>
            <td>${order.paymentStatus}</td>
            <td class="${order.status === 'Declined' ? 'danger' : order.status === 'Pending' ? 'warning' : 'primary'}">${order.status}</td>
            <td class="primary">Details</td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
}

// Example usage (replace this with your actual order data fetching logic)
const Orders = [
    {
        productName: 'Course 1',
        productNumber: '001',
        paymentStatus: 'Paid',
        status: 'Completed'
    },
    {
        productName: 'Course 2',
        productNumber: '002',
        paymentStatus: 'Pending',
        status: 'Pending'
    }
    // Add more orders as needed
];

// Call renderOrders to display initial orders
renderOrders(Orders);
