package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.OrderDTO;
import com.bookatable.reservationapp.model.CartItem;
import com.bookatable.reservationapp.model.Product;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.CartItemRepository;
import com.bookatable.reservationapp.repository.ProductRepository;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public List<CartItem> getCartItemsForReservation(Long reservationId) {
        return cartItemRepository.findByReservationId(reservationId);
    }

    public CartItem addToCart(CartItem cartItem) {
        Reservation reservation = reservationRepository.findById(cartItem.getReservation().getId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Product product = productRepository.findById(cartItem.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(cartItem.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!product.getRestaurant().getId().equals(reservation.getRestaurant().getId())) {
            throw new IllegalArgumentException("Product does not belong to the reservation's restaurant");
        }

        // Set entities fully populated
        cartItem.setReservation(reservation);
        cartItem.setProduct(product);
        cartItem.setUser(user);

        // Check for existing product in same reservation
        Optional<CartItem> existingItem = cartItemRepository.findByReservationIdAndProductId(
                reservation.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            return cartItemRepository.save(item);
        } else {
            return cartItemRepository.save(cartItem);
        }
    }

    public void removeFromCart(Long reservationId, Long productId) {
        cartItemRepository.findByReservationIdAndProductId(reservationId, productId)
                .ifPresent(cartItemRepository::delete);
    }

    public Double getTotalForReservation(Long reservationId) {
        return cartItemRepository.findByReservationId(reservationId)
                .stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public Double getTotalForUserInReservation(Long reservationId, Long userId) {
        return cartItemRepository
                .findByReservationIdAndUserId(reservationId, userId)
                .stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public CartItem transferCartItem(Long cartItemId, Long newUserId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        User newUser = userRepository.findById(newUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        item.setUser(newUser);
        return cartItemRepository.save(item);
    }

    public List<CartItem> getOrdersForRestaurant(Long restaurantId) {
        return cartItemRepository.findByProductRestaurantId(restaurantId);
    }

    public List<CartItem> getOrdersForDate(Long restaurantId, LocalDate date) {
        return cartItemRepository.findByRestaurantIdAndDate(restaurantId, date);
    }

    public List<OrderDTO> getOrderDTOsForDate(Long restaurantId, LocalDate date) {
        List<CartItem> items = cartItemRepository.findByRestaurantIdAndDate(restaurantId, date);

        return items.stream()
                .map(item -> new OrderDTO(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getUser().getFirstName() + " " + item.getUser().getLastName(),
                        item.getAddedAt(),
                        item.getReservation().getId(),
                        item.getUser().getId()
                ))
                .toList();
    }



}
