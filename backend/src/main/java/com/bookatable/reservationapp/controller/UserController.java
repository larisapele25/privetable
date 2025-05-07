package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ChangePasswordRequest;
import com.bookatable.reservationapp.dto.UserDTO;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.service.AuthService;
import com.bookatable.reservationapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;


@RestController
    @RequestMapping("/api/users")
    @CrossOrigin(origins = "*")
    public class UserController {

        @Autowired
        private UserService userService;
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/find-by-email")
    public ResponseEntity<?> findUserByEmail(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok((user.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
        @GetMapping("/{userId}/favorites")
        public ResponseEntity<Set<Restaurant>> getFavorites(@PathVariable Long userId) {
            return ResponseEntity.ok(userService.getFavoriteRestaurants(userId));
        }

        @PostMapping("/{userId}/favorites/{restaurantId}")
        public ResponseEntity<Void> addFavorite(
                @PathVariable Long userId,
                @PathVariable Long restaurantId) {
            userService.addFavorite(userId, restaurantId);
            return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{userId}/favorites/{restaurantId}")
        public ResponseEntity<Void> removeFavorite(
                @PathVariable Long userId,
                @PathVariable Long restaurantId) {
            userService.removeFavorite(userId, restaurantId);
            return ResponseEntity.ok().build();
        }
    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getEmail(),
                user.isVerified() // presupunem că ai acest câmp în model
        );
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        System.out.println("🟢 ID primit: " + request.getUserId());
        authService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }




}

