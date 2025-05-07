package com.bookatable.reservationapp.controller;

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
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        return new ResponseEntity<>(cartItemService.addToCart(cartItem), HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{reservationId}/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long reservationId, @PathVariable Long productId) {
        cartItemService.removeFromCart(reservationId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long reservationId) {
        return ResponseEntity.ok(cartItemService.getCartItemsForReservation(reservationId));
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
