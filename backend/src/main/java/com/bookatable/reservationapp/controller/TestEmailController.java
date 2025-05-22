package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestEmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-review")
    public ResponseEntity<String> testSendReview(
            @RequestParam String to,
            @RequestParam String name,
            @RequestParam String restaurant,
            @RequestParam Long reservationId,
            @RequestParam Long userId,
            @RequestParam Long restaurantId
    ) {
        emailService.sendReviewRequestEmail(to, name, restaurant);
        return ResponseEntity.ok("Email de review trimis către " + to);
    }
}
