package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.RestaurantAccount;
import com.bookatable.reservationapp.repository.RestaurantAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class RestaurantAccountService {

    private final RestaurantAccountRepository restaurantAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public RestaurantAccountService(RestaurantAccountRepository repository, PasswordEncoder encoder) {
        this.restaurantAccountRepository = repository;
        this.passwordEncoder = encoder;
    }

    public RestaurantAccount createAccount(Restaurant restaurant) {
        String loginCode = generateLoginCode();
        String rawPassword = generateRandomPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);

        RestaurantAccount account = new RestaurantAccount();
        account.setRestaurant(restaurant);
        account.setLoginCode(loginCode);
        account.setPasswordHash(hashedPassword);

        restaurantAccountRepository.save(account);

        // Parola afișată în consolă — doar pentru dezvoltare/demo
        System.out.println("Login code: " + loginCode + " | Password: " + rawPassword);

        return account;
    }

    private String generateLoginCode() {
        return "R" + UUID.randomUUID().toString().substring(0, 4).toUpperCase() + "-" +
                (1000 + new Random().nextInt(9000));
    }

    private String generateRandomPassword() {
        return RandomStringUtils.random(8, true, true);
    }

    public List<Map<String, String>> getAllWithLoginCodes() {
        return restaurantAccountRepository.findAll().stream()
                .map(acc -> Map.of(
                        "name", acc.getRestaurant().getName(),
                        "loginCode", acc.getLoginCode()
                ))
                .toList();
    }
}
