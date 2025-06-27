package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.NotificationDTO;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // dacă ai frontend pe alt port
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getForUser(userId)
                        .stream()
                        .map(NotificationDTO::new)
                        .toList()
        );
    }


    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable Long userId) {
        int count = notificationRepository.countByRecipientIdAndReadFalse(userId);
        return ResponseEntity.ok(count);
    }
    @PutMapping("/mark-as-read/{userId}")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdAndReadFalse(userId);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok("Notifications have been marked as read");
    }


    @PutMapping("/cleanup/{userId}")
    public ResponseEntity<?> cleanupOldOrAcceptedInvites(@PathVariable Long userId) {
        List<Notification> all = notificationRepository.findByRecipientId(userId);
        List<Notification> toMarkDeleted = new ArrayList<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (Notification n : all) {
            if ("INVITE".equals(n.getType()) && n.getReservationId() != null) {
                Reservation res = reservationRepository.findById(n.getReservationId()).orElse(null);
                if (res == null) continue;

                boolean isPast = res.getDateTime().isBefore(java.time.LocalDateTime.now());
                boolean hasJoined = res.getParticipants().stream()
                        .anyMatch(p -> p.getId().equals(user.getId()));

                if (isPast || hasJoined) {
                    n.setDeleted(true);
                    toMarkDeleted.add(n);
                }
            }
        }

        notificationRepository.saveAll(toMarkDeleted);
        return ResponseEntity.ok("Notifications have been marked as deleted.");
    }



    @GetMapping("/menu-updates/{userId}")
    public List<Notification> getMenuUpdateNotifications(@PathVariable Long userId) {
        return notificationRepository.findByRecipientId(userId).stream()
                .filter(n -> "MENU_UPDATE".equals(n.getType()))
                .toList();
    }


}
