package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.RestaurantInfoDTO;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.RestaurantAccount;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.service.RestaurantAccountService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${admin.secret}")
    private String adminSecret;

    private final RestaurantRepository restaurantRepository;
    private final RestaurantAccountService restaurantAccountService;

    public AdminController(RestaurantRepository restaurantRepository,
                           RestaurantAccountService restaurantAccountService) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantAccountService = restaurantAccountService;
    }

    @PostMapping("/add-restaurant")
    public ResponseEntity<?> addRestaurant(
            @RequestHeader("X-ADMIN-CODE") String adminCode,
            @RequestBody Restaurant restaurant
    ) {
        if (!adminSecret.equals(adminCode)) {
            return ResponseEntity.status(403).body("Cod de acces invalid.");
        }

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        RestaurantAccount account = restaurantAccountService.createAccount(savedRestaurant);

        RestaurantInfoDTO dto = new RestaurantInfoDTO(
                savedRestaurant.getId(),
                savedRestaurant.getCapacity(),
                savedRestaurant.getName(),
                savedRestaurant.getImageUrl(),
                account.getLoginCode()

        );

        System.out.println("Parola generată: (este în consolă)");

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/all-restaurants")
    public ResponseEntity<List<Map<String, String>>> getAllRestaurants(@RequestHeader("X-ADMIN-CODE") String code) {
        if (!adminSecret.equals(code)) {
            return ResponseEntity.status(403).build();
        }

        List<Map<String, String>> response = restaurantAccountService.getAllWithLoginCodes();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/restaurants-with-codes")
    public List<Map<String, String>> getAllRestaurantsWithLoginCodes(
            @RequestHeader("X-ADMIN-CODE") String adminCode
    ) {
        if (!adminSecret.equals(adminCode)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cod invalid");
        }

        return restaurantAccountService.getAllWithLoginCodes();
    }


}
