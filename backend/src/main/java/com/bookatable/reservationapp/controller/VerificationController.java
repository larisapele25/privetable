package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.VerificationRequestDTO;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.model.UserVerification;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.repository.UserVerificationRepository;
import com.bookatable.reservationapp.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/verify")
public class VerificationController {

    @Value("${admin.secret}")
    private String adminSecret;
    @Autowired
    private VerificationService verificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserVerificationRepository verificationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ Submit cerere de verificare
    @PostMapping("/submit")
    public ResponseEntity<String> manualVerificationSubmit(
            @RequestParam("userId") Long userId,
            @RequestParam("name") String name,
            @RequestParam("surname") String surname,
            @RequestParam("cnp") String cnp,
            @RequestParam("idNumber") String idNumber,
            @RequestParam("frontImage") MultipartFile frontImage,
            @RequestParam("backImage") MultipartFile backImage
    ) {
        try {
            System.out.println("PRIMIT userId: " + userId);

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Utilizator inexistent.");
            }

            if (verificationRepository.findByUserId(userId).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ai deja o cerere de verificare trimisă.");
            }

            VerificationRequestDTO dto = new VerificationRequestDTO();
            dto.setUserId(userId);
            dto.setName(name);
            dto.setSurname(surname);
            dto.setCnp(cnp);
            dto.setIdNumber(idNumber);
            dto.setFrontImage(frontImage);
            dto.setBackImage(backImage);

            UserVerification saved = verificationService.submitVerification(dto);

            // 🔔 Notificare: verificare în curs
            Notification noti = new Notification();
            noti.setRecipient(userOpt.get());
            noti.setType("VERIFICATION");
            noti.setMessage("Account verification is in progress. It may take up to 24 hours.");
            noti.setTimestamp(LocalDateTime.now());
            noti.setVerificationId(saved.getId());
            notificationRepository.save(noti);

            return ResponseEntity.ok("Verification sent. An administrator will process it manually.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    // ✅ Aprobă cererea
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        return verificationRepository.findById(id).map(verification -> {
            verification.setVerificationStatus(true);
            verification.setReviewedByAdmin(true);
            verificationRepository.save(verification);

            User user = verification.getUser();
            if (user != null) {
                user.setVerified(true);
                userRepository.save(user);

                Notification noti = new Notification();
                noti.setRecipient(user);
                noti.setType("VERIFICATION");
                noti.setMessage("Your account has been successfully verified.");
                noti.setTimestamp(LocalDateTime.now());
                if (verification.getId() != null) {
                    noti.setVerificationId(verification.getId());
                } else {
                    System.out.println(" WARNING: verification ID is null!");
                }
                notificationRepository.save(noti);

            }

            return ResponseEntity.ok("Verification approved.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("ID inexistent."));
    }

    // ✅ Respinge cererea
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestParam(required = false) String comment) {
        return verificationRepository.findById(id).map(verification -> {
            verification.setVerificationStatus(false);
            verification.setReviewedByAdmin(true);
            verification.setAdminComment(comment);
            verificationRepository.save(verification);

            User user = verification.getUser();
            if (user != null) {
                Notification noti = new Notification();
                noti.setRecipient(user);
                noti.setType("VERIFICATION");
                String message = "Your account has not been verified.";
                if (comment != null && !comment.isBlank()) {
                    message += " Reason: " + comment;
                }
                noti.setMessage(message);
                noti.setTimestamp(LocalDateTime.now());
                noti.setVerificationId(verification.getId());
                notificationRepository.save(noti);
            }

            return ResponseEntity.ok("Verification rejected.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("ID inexistent."));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getVerificationStatus(@PathVariable Long id) {
        return verificationRepository.findById(id)
                .map(verification -> {
                    Map<String, Object> response = new HashMap<>();

                    if (verification.isReviewedByAdmin()) {
                        // dacă a fost aprobat
                        if (verification.isVerificationStatus()) {
                            response.put("status", "APPROVED");
                        } else {
                            response.put("status", "REJECTED"); // dacă a fost respins
                        }
                    } else {
                        response.put("status", "PENDING"); // încă neprocesat
                    }

                    response.put("reviewed", verification.isReviewedByAdmin());
                    response.put("comment", verification.getAdminComment());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        Map.of("error", "Verification not found.")
                ));
    }






    // ✅ Obține toate verificările
    @GetMapping("/all")
    public ResponseEntity<?> getAllVerifications(@RequestHeader("X-ADMIN-CODE") String adminCode) {
        if (!adminSecret.equals(adminCode)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cod admin invalid");
        }
        return ResponseEntity.ok(verificationRepository.findAll());
    }
}
