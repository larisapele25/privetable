package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
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
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        return notificationRepository.findByRecipientIdOrderByTimestampDesc(userId);
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
        return ResponseEntity.ok("Notificările au fost marcate ca citite");
    }
    @DeleteMapping("/delete-invite/{userId}/{reservationId}")
    public ResponseEntity<?> deleteInviteNotification(@PathVariable Long userId, @PathVariable Long reservationId) {
        List<Notification> notifs = notificationRepository.findByRecipientId(userId);
        for (Notification notif : notifs) {
            if ("INVITE".equals(notif.getType()) && reservationId.equals(notif.getReservationId())) {
                notificationRepository.delete(notif);
            }
        }
        return ResponseEntity.ok("Notification deleted");
    }

    @DeleteMapping("/cleanup/{userId}")
    public ResponseEntity<?> cleanupOldOrAcceptedInvites(@PathVariable Long userId) {
        List<Notification> all = notificationRepository.findByRecipientId(userId);
        List<Notification> toDelete = new ArrayList<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        for (Notification n : all) {
            if ("INVITE".equals(n.getType()) && n.getReservationId() != null) {
                Reservation res = reservationRepository.findById(n.getReservationId()).orElse(null);
                if (res == null) continue;

                boolean isPast = res.getDateTime().isBefore(java.time.LocalDateTime.now());
                boolean hasJoined = res.getParticipants().contains(user);

                if (isPast || hasJoined) {
                    toDelete.add(n);
                }
            }
        }

        notificationRepository.deleteAll(toDelete);
        return ResponseEntity.ok("Notificările expirate sau acceptate au fost șterse");
    }

    @GetMapping("/menu-updates/{userId}")
    public List<Notification> getMenuUpdateNotifications(@PathVariable Long userId) {
        return notificationRepository.findByRecipientId(userId).stream()
                .filter(n -> "MENU_UPDATE".equals(n.getType()))
                .toList();
    }


}
