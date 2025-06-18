package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.RestaurantToUserReviewRequest;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.model.UserReviewByRestaurant;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.repository.UserReviewByRestaurantRepository;
import com.bookatable.reservationapp.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class RestaurantReviewUserController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final UserReviewByRestaurantRepository reviewRepository;
    private final EmailService emailService;
    public RestaurantReviewUserController(ReservationRepository reservationRepo, UserRepository userRepo, UserReviewByRestaurantRepository reviewRepo, EmailService emailService) {
        this.reservationRepository = reservationRepo;
        this.userRepository = userRepo;
        this.reviewRepository = reviewRepo;
        this.emailService = emailService;
    }

    @PostMapping("/user")
    public ResponseEntity<?> leaveReview(
            @RequestBody RestaurantToUserReviewRequest request,
            HttpServletRequest servletRequest
    ) {
        Long restaurantId = (Long) servletRequest.getAttribute("restaurantId");

        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.existsByReservationIdAndUserId(reservation.getId(), user.getId())) {
            return ResponseEntity.badRequest().body("Review already exists for this user in this reservation.");
        }

        UserReviewByRestaurant review = new UserReviewByRestaurant();
        review.setUser(user);
        review.setReservation(reservation);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setRestaurant(reservation.getRestaurant());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        emailService.sendReviewReceivedEmail(
                user.getEmail(),
                user.getFirstName() != null ? user.getFirstName() : user.getEmail(),
                reservation.getRestaurant().getName(),
                request.getRating(),
                request.getComment()
        );


        return ResponseEntity.ok("Review submitted and email sent.");
    }

    @GetMapping("/about-user/{userId}")
    public ResponseEntity<?> getReviewsAboutUser(@PathVariable Long userId) {
        List<UserReviewByRestaurant> reviews = reviewRepository.findByUserId(userId);

        return ResponseEntity.ok(reviews.stream().map(review -> Map.of(
                "restaurantName", review.getRestaurant().getName(),
                "rating", review.getRating(),
                "comment", review.getComment(),
                "createdAt", review.getCreatedAt(),
                "reservationId", review.getReservation().getId()
        )).toList());
    }


}
