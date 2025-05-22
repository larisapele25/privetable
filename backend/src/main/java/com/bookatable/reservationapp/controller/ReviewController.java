package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.model.*;
import com.bookatable.reservationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long restaurantId = Long.valueOf(body.get("restaurantId").toString());
        Long reservationId = Long.valueOf(body.get("reservationId").toString());
        int rating = (int) body.get("rating");
        String comment = (String) body.getOrDefault("comment", "");

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Restaurant> restOpt = restaurantRepository.findById(restaurantId);
        Optional<Reservation> resOpt = reservationRepository.findById(reservationId);

        if (userOpt.isEmpty() || restOpt.isEmpty() || resOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Date invalide.");
        }

        User user = userOpt.get();
        Reservation reservation = resOpt.get();

        // ✅ 1. Verificăm dacă e creator sau participant
        boolean isCreator = reservation.getUser().getId().equals(userId);
        boolean isParticipant = reservation.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userId));

        if (!isCreator && !isParticipant) {
            return ResponseEntity.status(403).body("Nu ai participat la această rezervare.");
        }

        // ✅ 2. Verificăm dacă rezervarea este în trecut
        if (reservation.getDateTime().isAfter(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Nu poți lăsa review pentru o rezervare viitoare.");
        }

        // ✅ 3. Verificăm dacă există deja review pentru acest user + rezervare
        List<Review> existing = reviewRepository.findByUserId(userId);
        boolean alreadyReviewed = existing.stream()
                .anyMatch(r -> r.getReservation().getId().equals(reservationId));

        if (alreadyReviewed) {
            return ResponseEntity.badRequest().body("Ai trimis deja un review pentru această rezervare.");
        }

        // ✅ 4. Creăm review-ul
        Review review = new Review();
        review.setUser(user);
        review.setRestaurant(restOpt.get());
        review.setReservation(reservation);
        review.setRating(rating);
        review.setComment(comment);

        reviewRepository.save(review);
        return ResponseEntity.ok("Review salvat cu succes.");
    }


    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<Review>> getReviewsForRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(reviewRepository.findByRestaurantId(id));
    }
}
