package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.RestaurantWithRatingDTO;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantService restaurantService, UserRepository userRepository, RestaurantRepository restaurantRepository) {
        this.restaurantService = restaurantService;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/booked-before")
    public Set<RestaurantDTO> getVisitedRestaurants(@RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return restaurantService.getRestaurantsBookedBefore(user)
                .stream()
                .map(RestaurantDTO::from)
                .collect(java.util.stream.Collectors.toSet());
    }

    @GetMapping("/all-admin")
    public List<Restaurant> getAllRestaurantsAdmin(@RequestHeader("X-ADMIN-CODE") String adminCode) {
        if (!adminCode.equals("qPL82fWdX9kRuM7CZtAjvENoB63yhs0K")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces interzis");
        }
        return restaurantRepository.findAll();
    }

    @GetMapping("/all")
    public List<RestaurantWithRatingDTO> getAllRestaurants() {
        return restaurantRepository.findAllWithAverageRating();
    }

    public record RestaurantDTO(Long id, String name, String imageUrl) {
        public static RestaurantDTO from(Restaurant r) {
            return new RestaurantDTO(r.getId(), r.getName(), r.getImageUrl());
        }
    }
}
