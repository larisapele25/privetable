package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.ChangePasswordRequest;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
@Transactional
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;


    @Autowired
    public UserService(UserRepository userRepository, RestaurantRepository restaurantRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public Set<Restaurant> getFavoriteRestaurants(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return optionalUser.get().getFavoriteRestaurants();
    }

    public void addFavorite(Long userId, Long restaurantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        user.addFavoriteRestaurant(restaurant); // adaugă în listă

        userRepository.save(user); // ← AICI trebuie să salvezi schimbarea!
    }


    public void removeFavorite(Long userId, Long restaurantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        user.removeFavoriteRestaurant(restaurant);
        userRepository.save(user);
    }
}
