package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ReviewWithUserEmailDTO;
import com.bookatable.reservationapp.model.*;
import com.bookatable.reservationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private ReservationRepository reservationRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Long restaurantId = Long.valueOf(body.get("restaurantId").toString());
            Long reservationId = Long.valueOf(body.get("reservationId").toString());
            int rating = Integer.parseInt(body.get("rating").toString());
            String comment = (String) body.getOrDefault("comment", "");

            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Restaurant> restOpt = restaurantRepository.findById(restaurantId);
            Optional<Reservation> resOpt = reservationRepository.findById(reservationId);

            if (userOpt.isEmpty() || restOpt.isEmpty() || resOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Date invalide.");
            }

            User user = userOpt.get();
            Reservation reservation = resOpt.get();

            //  Verificare participare
            boolean isCreator = reservation.getUser().getId().equals(userId);
            boolean isParticipant = reservation.getParticipants().stream()
                    .anyMatch(p -> p.getId().equals(userId));

            if (!isCreator && !isParticipant) {
                return ResponseEntity.status(403).body("You did not participate in this reservation.");
            }

            // Verificare dacă rezervarea este în trecut
            if (reservation.getDateTime().isAfter(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("You cannot leave a review for a future booking.");
            }

            // Prevenire review dublu
            boolean alreadyReviewed = reviewRepository.findByUserId(userId).stream()
                    .anyMatch(r -> r.getReservation().getId().equals(reservationId));

            if (alreadyReviewed) {
                return ResponseEntity.badRequest().body("You have already submitted a review for this reservation.");
            }

            //  Creare review
            Review review = new Review();
            review.setUser(user);
            review.setRestaurant(restOpt.get());
            review.setReservation(reservation);
            review.setRating(rating);
            review.setComment(comment);

            reviewRepository.save(review);
            return ResponseEntity.ok("Review saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Eroare internă: " + e.getMessage());
        }
    }



    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewWithUserEmailDTO>> getReviewsForRestaurant(@PathVariable Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);

        List<ReviewWithUserEmailDTO> result = reviews.stream().map(review -> {
            ReviewWithUserEmailDTO dto = new ReviewWithUserEmailDTO();
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setUserEmail(review.getUser().getEmail());
            dto.setReservationDateTime(review.getReservation().getDateTime());
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }



}
