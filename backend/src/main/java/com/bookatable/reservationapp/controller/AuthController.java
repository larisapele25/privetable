package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ForgotPasswordRequest;
import com.bookatable.reservationapp.dto.LoginRequest;
import com.bookatable.reservationapp.dto.RegisterRequest;
import com.bookatable.reservationapp.dto.ResetPasswordRequest;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.service.AuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

            return ResponseEntity.ok(
                    Map.of(
                            "userId", user.getId(),
                            "message", "Login successful"
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", e.getMessage()));
        }
    }




    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendResetCode(request);
        return ResponseEntity.ok("Reset code sent");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("The password has been reset successfully.");
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> loginWithFirebase(@RequestBody Map<String, String> body) {
        String idToken = body.get("token");

        try {

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = (String) decodedToken.getClaims().get("name");

            User user = authService.findOrCreateFirebaseUser(email, name);

            return ResponseEntity.ok(Map.of(
                    "userId", user.getId(),
                    "message", "Login Firebase reușit"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Token Firebase invalid: " + e.getMessage()));
        }
    }



}
