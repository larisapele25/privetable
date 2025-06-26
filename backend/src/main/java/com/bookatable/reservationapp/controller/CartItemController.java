package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.CartItemDTO;
import com.bookatable.reservationapp.model.CartItem;
import com.bookatable.reservationapp.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody CartItem cartItem) {
        cartItemService.addToCart(cartItem);
        return ResponseEntity.status(HttpStatus.CREATED).body("Product added to cart successfully.");
    }


    @DeleteMapping("/remove/{reservationId}/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long reservationId, @PathVariable Long productId) {
        cartItemService.removeFromCart(reservationId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable Long reservationId) {
        List<CartItem> items = cartItemService.getCartItemsForReservation(reservationId);
        List<CartItemDTO> dtos = items.stream()
                .map(CartItemDTO::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/total/{reservationId}")
    public ResponseEntity<Double> getCartTotal(@PathVariable Long reservationId) {
        return ResponseEntity.ok(cartItemService.getTotalForReservation(reservationId));
    }
    @GetMapping("/total/{reservationId}/user/{userId}")
    public ResponseEntity<Double> getUserTotal(
            @PathVariable Long reservationId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(cartItemService.getTotalForUserInReservation(reservationId, userId));
    }
    @PutMapping("/transfer/{cartItemId}/to/{userId}")
    public ResponseEntity<CartItem> transferCartItemToUser(
            @PathVariable Long cartItemId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(cartItemService.transferCartItem(cartItemId, userId));
    }

}
