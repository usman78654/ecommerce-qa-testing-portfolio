# Requirements and Product Risks

Requirements below are derived from the application behavior and source, not
from a formal product specification. Any ambiguity discovered during execution
is recorded as a product question.

| ID | Requirement | Risk |
| --- | --- | --- |
| AUTH-01 | A visitor can register with name, unique email, password, and matching confirmation | High |
| AUTH-02 | A registered user can log in with valid credentials and receives a protected session | Critical |
| AUTH-03 | Invalid credentials are rejected without exposing account details | High |
| AUTH-04 | Logout clears the authenticated session and customer cart state | High |
| AUTH-05 | A customer can view and update their own profile | High |
| CAT-01 | Visitors can list products with pagination | Medium |
| CAT-02 | Search matches product names case-insensitively and handles no results | Medium |
| CAT-03 | Product detail shows price, stock, rating, description, and purchase controls | High |
| CAT-04 | Out-of-stock products cannot be added to the cart | High |
| REV-01 | An authenticated customer can submit one review per product | Medium |
| CART-01 | A visitor can add an in-stock product with quantity between 1 and available stock | High |
| CART-02 | A shopper can update quantities and remove items | High |
| CART-03 | Subtotal, item count, and derived prices remain accurate to two decimals | Critical |
| CART-04 | Cart and shipping details persist on refresh and are isolated between users | High |
| CHK-01 | Checkout requires authentication and returns the user to the intended step | High |
| CHK-02 | Shipping address requires address, city, postal code, and country | High |
| CHK-03 | Customer selects an available payment method before review | High |
| ORD-01 | An authenticated customer can place a non-empty order | Critical |
| ORD-02 | Order prices are calculated from server product prices, not client-supplied prices | Critical |
| ORD-03 | A customer can view their order history and permitted order details | Critical |
| ADM-01 | Only admins can access user, product, and order administration operations | Critical |
| ADM-02 | Admin can create, edit, and delete products | High |
| ADM-03 | Admin can list users and update or delete non-admin accounts | High |
| ADM-04 | Admin can list orders and mark an order delivered | High |
| UX-01 | Core customer workflows remain usable at desktop and 375px mobile viewport | Medium |
| ERR-01 | API errors use an appropriate status code and JSON message without secrets | High |
