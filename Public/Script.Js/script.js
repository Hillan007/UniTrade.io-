// Cart functionality
        let cart = [];
        let purchaseHistory = [];

        function addToCart(item) {
            cart.push(item);
            displayCart();
            openCart();
        }

        function displayCart() {
            let cartContent = document.getElementById('cartContent');
            cartContent.innerHTML = '';

            if (cart.length === 0) {
                cartContent.innerHTML = '<p>No items in cart.</p>';
            } else {
                cart.forEach((item, index) => {
                    cartContent.innerHTML += `
                        <div class="cart-item">
                            <span>${item}</span>
                            <button onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    `;
                });
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            displayCart();
        }

        function openCart() {
            document.getElementById('cartModal').style.display = 'flex';
        }

        function closeCart() {
            document.getElementById('cartModal').style.display = 'none';
        }

        // Example: Generate receipt after purchase
        function purchaseItems() {
            const cartContent = document.getElementById("cartContent").innerHTML;
            document.getElementById("receiptContent").innerHTML = `<h3>Purchase Receipt</h3>${cartContent}`;
            openReceipt();
        }

        function displayPurchaseHistory() {
            let historyList = document.getElementById('purchaseHistoryList');
            historyList.innerHTML = '';

            if (purchaseHistory.length === 0) {
                historyList.innerHTML = '<li>No purchases yet.</li>';
            } else {
                purchaseHistory.forEach(item => {
                    historyList.innerHTML += `<li>${item}</li>`;
                });
            }
        }

        // Open and close registration form
        function openRegistrationForm() {
            document.getElementById("registrationForm").style.display = "flex";
        }

        function closeRegistrationForm() {
            document.getElementById("registrationForm").style.display = "none";
        }

        function submitRegistration() {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Registration failed: " + data.error);
                } else {
                    alert("Registration successful! Your user ID is: " + data.userId);
                    closeRegistrationForm();
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred during registration.");
            });
        }

        // Open and close receipt modal
        function openReceipt() {
            document.getElementById("receiptModal").style.display = "flex";
        }

        function closeReceipt() {
            document.getElementById("receiptModal").style.display = "none";
        }

        // Print receipt
        function printReceipt() {
            const receiptContent = document.getElementById("receiptContent").innerHTML;
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`<html><head><title>Receipt</title></head><body>${receiptContent}</body></html>`);
            printWindow.document.close();
            printWindow.print();
        }

        // Tab functionality
        function openTab(tabName) {
            const tabs = document.getElementsByClassName('tab-content');
            const buttons = document.getElementsByClassName('tab-btn');

            for (let tab of tabs) {
                tab.classList.remove('active');
            }
            for (let btn of buttons) {
                btn.classList.remove('active');
            }

            document.getElementById(tabName).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        // Event listeners
        document.getElementById('cartButton').addEventListener('click', openCart);

        // Debugging video loading
        window.onload = function() {
            const video = document.getElementById('liveVideo');
            video.addEventListener('error', function(e) {
                console.error('Video failed to load:', e);
                alert('Error: Could not load video. Check if "campus2.mp4" is in the correct directory.');
            });
            video.addEventListener('loadeddata', function() {
                console.log('Video loaded successfully');
            });
        };

        function searchProducts() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                const description = item.querySelector('.gallery-description').textContent.toLowerCase();
                const shouldShow = description.includes(searchInput);
                item.classList.toggle('hidden', !shouldShow);
            });

            // Show appropriate tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => {
                const hasVisibleItems = tab.querySelector('.gallery-item:not(.hidden)');
                tab.classList.toggle('hidden', !hasVisibleItems);
            });

            // If search is empty, reset to default view
            if (searchInput === '') {
                galleryItems.forEach(item => item.classList.remove('hidden'));
                const activeTab = document.querySelector('.tab-content.active');
                tabContents.forEach(tab => {
                    tab.classList.remove('hidden');
                    tab.style.display = tab === activeTab ? 'flex' : 'none';
                });
            }
        }

        // Add event listener for real-time search
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', searchProducts);
        });
