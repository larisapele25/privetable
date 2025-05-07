package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.service.RestaurantService;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
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

    @GetMapping("/all")
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public record RestaurantDTO(Long id, String name, String imageUrl) {
        public static RestaurantDTO from(Restaurant r) {
            return new RestaurantDTO(r.getId(), r.getName(), r.getImageUrl());
        }
    }



}
