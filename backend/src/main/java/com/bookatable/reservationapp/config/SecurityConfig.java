package com.bookatable.reservationapp.config;

import com.bookatable.reservationapp.security.RestaurantJwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final RestaurantJwtFilter restaurantJwtFilter;


    public SecurityConfig(RestaurantJwtFilter restaurantJwtFilter) {
        this.restaurantJwtFilter = restaurantJwtFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/restaurant/login").permitAll()
                        .requestMatchers("/api/restaurant/generate-account/**" ).permitAll()
                        .requestMatchers("/api/restaurant-panel/**").authenticated()
                        .requestMatchers("/api/restaurant/**").authenticated()
                        .requestMatchers("/api/products/**").permitAll()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(restaurantJwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
