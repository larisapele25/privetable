package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.RestaurantLoginRequest;
import com.bookatable.reservationapp.dto.RestaurantLoginResponse;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.RestaurantAccount;
import com.bookatable.reservationapp.repository.RestaurantAccountRepository;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.service.JwtService;
import com.bookatable.reservationapp.service.RestaurantAccountService;
import com.bookatable.reservationapp.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantLogin {

    private final RestaurantAccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RestaurantAccountService restaurantAccountService;
    private final RestaurantRepository restaurantRepository;
    public RestaurantLogin(RestaurantAccountRepository repo, PasswordEncoder encoder, JwtService jwtService, RestaurantAccountService restaurantAccountService, RestaurantRepository restaurantRepository) {
        this.accountRepository = repo;
        this.passwordEncoder = encoder;
        this.jwtService = jwtService;
        this.restaurantRepository=restaurantRepository;
        this.restaurantAccountService=restaurantAccountService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RestaurantLoginRequest request) {
        Optional<RestaurantAccount> optional = accountRepository.findByLoginCode(request.getLoginCode());

        if (optional.isEmpty() ||
                !passwordEncoder.matches(request.getPassword(), optional.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        RestaurantAccount account = optional.get();
        String token = jwtService.generateToken(account.getRestaurant().getId());

        return ResponseEntity.ok(new RestaurantLoginResponse(token, account.getRestaurant().getId(),account.getRestaurant().getName()));
    }

    @PostMapping("/generate-account/{restaurantId}")
    public ResponseEntity<?> generateAccountForRestaurant(@PathVariable Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        RestaurantAccount account = restaurantAccountService.createAccount(restaurant);

        return ResponseEntity.ok("LoginCode: " + account.getLoginCode() + ", Password: vezi consola");
    }


}
