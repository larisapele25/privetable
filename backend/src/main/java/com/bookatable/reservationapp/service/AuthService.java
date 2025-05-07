package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.*;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bookatable.reservationapp.service.EmailService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email != null && email.matches(emailRegex);
    }

    private boolean isStrongPassword(String password) {
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.,;:<>#^(){}\\[\\]~`|/+_-])[A-Za-z\\d@$!%*?&.,;:<>#^(){}\\[\\]~`|/+_-]{8,}$";
        return password != null && password.matches(passwordRegex);
    }

    public String register(RegisterRequest request) {
        // 1. Email valid
        if (!isValidEmail(request.getEmail())) {
            return "Invalid email format";
        }

        // 2. Email match
        if (!request.getEmail().equals(request.getConfirmEmail())) {
            return "Email addresses do not match";
        }

        // 3. Password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return "Passwords do not match";
        }

        // 4. Password strength
        if (!isStrongPassword(request.getPassword())) {
            return "Password must be at least 8 characters, include upper & lower case letters, a digit and a special character";
        }
        // 5. Email already used
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        // Save user
        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);
        return "User registered successfully";
    }
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email sau parolă greșite"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Email sau parolă greșite");
        }

        return user;
    }




    public void sendResetCode(ForgotPasswordRequest request) {
        String email = request.getEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found");
        }

        User user = userOpt.get();
        String resetCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase(); // gen ex: "4FJ9D2"

        user.setResetCode(resetCode);
        user.setResetCodeTimestamp(LocalDateTime.now());
        userRepository.save(user);

        // trimite email
        emailService.sendResetCodeEmail(user.getEmail(), resetCode);
    }
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Codul de resetare este invalid."));

        LocalDateTime timestamp = user.getResetCodeTimestamp();
        if (timestamp == null || timestamp.isBefore(LocalDateTime.now().minusMinutes(15))) {
            throw new RuntimeException("Codul de resetare a expirat.");
        }



        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Parolele nu se potrivesc.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetCode(null);
        user.setResetCodeTimestamp(null);
        userRepository.save(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID lipsă.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parola curentă este greșită.");
        }

        if (!isStrongPassword(request.getNewPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Noua parolă nu respectă criteriile de securitate.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}
