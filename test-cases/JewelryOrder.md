### TC-JEW-001: Order an in-stock Jewelry product as a guest
- Priority: High
- Type: Positive
- Preconditions:
  - Demo Web Shop is reachable.
  - Shopping cart is empty.
  - Guest checkout is available.
- Test data:
  - Category: Jewelry
  - Product: Black & White Diamond Heart
  - Product route: /black-white-diamond-heart
  - Unit price: 130.00
  - Quantity: 1
  - Checkout data: repository default guest checkout data

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Open the Demo Web Shop root URL. | The store home page is displayed. |
| 2 | Open the Jewelry category. | The Jewelry page is displayed and lists jewelry products. |
| 3 | Open Black & White Diamond Heart. | The product page displays the product as in stock, with price 130.00 and quantity 1. |
| 4 | Add the product to the cart. | A confirmation states that the product was added to the shopping cart, and the cart count becomes 1. |
| 5 | Open the shopping cart. | The cart contains Black & White Diamond Heart with quantity 1, unit price 130.00, and subtotal 130.00. |
| 6 | Accept the terms of service and proceed to checkout. | The checkout options page is displayed. |
| 7 | Continue as a guest. | The billing address step is displayed. |
| 8 | Enter the guest billing data and continue. | The shipping address step is displayed. |
| 9 | Continue through shipping address, shipping method, credit-card payment, and payment information. | Each checkout step completes and the confirm-order step is displayed. |
| 10 | Confirm the order. | The order completes and an order confirmation page is displayed. |
