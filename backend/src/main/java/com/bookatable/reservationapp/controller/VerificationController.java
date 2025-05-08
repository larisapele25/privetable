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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/verify")
public class VerificationController {

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
            noti.setMessage("Verificarea contului este în curs. Poate dura până la 24h.");
            noti.setTimestamp(LocalDateTime.now());
            noti.setVerificationId(saved.getId());
            notificationRepository.save(noti);

            return ResponseEntity.ok("Verificare trimisă. Un administrator o va procesa manual.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Eroare: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server: " + e.getMessage());
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
                noti.setMessage("Contul tău a fost verificat cu succes.");
                noti.setTimestamp(LocalDateTime.now());

//  Siguranță: setează ID-ul explicit DOAR dacă este salvat
                if (verification.getId() != null) {
                    noti.setVerificationId(verification.getId());
                } else {
                    System.out.println(" WARNING: verification ID is null!");
                }
                notificationRepository.save(noti);

            }

            return ResponseEntity.ok("Verificare aprobată.");
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
                String message = "Contul tău nu a fost verificat.";
                if (comment != null && !comment.isBlank()) {
                    message += " Motiv: " + comment;
                }
                noti.setMessage(message);
                noti.setTimestamp(LocalDateTime.now());
                noti.setVerificationId(verification.getId());
                notificationRepository.save(noti);
            }

            return ResponseEntity.ok("Verificare respinsă.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("ID inexistent."));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getVerificationStatus(@PathVariable Long id) {
        return verificationRepository.findById(id)
                .map(verification -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", verification.isVerificationStatus() ? "APPROVED" : "PENDING");
                    response.put("reviewed", verification.isReviewedByAdmin());
                    response.put("comment", verification.getAdminComment()); // poate fi null, e OK
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        Map.of("error", "Verificarea nu a fost găsită")
                ));
    }




    // ✅ Obține toate verificările
    @GetMapping("/all")
    public ResponseEntity<?> getAllVerifications() {
        return ResponseEntity.ok(verificationRepository.findAll());
    }
}
