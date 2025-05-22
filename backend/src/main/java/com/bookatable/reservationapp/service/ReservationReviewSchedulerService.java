package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationReviewSchedulerService {


    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Scheduled(cron = "0 */5 * * * *") // la fiecare 8 minute
    @Transactional
    public void sendReviewRequests() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> pastReservations = reservationRepository.findAll().stream()
                .filter(r -> r.getDateTime().plusHours(r.getDuration()).isBefore(now))
                .filter(r -> !Boolean.TRUE.equals(r.isNotified()))
                .toList();

        int totalSent = 0;

        for (Reservation r : pastReservations) {
            Long reservationId = r.getId();
            Long restaurantId = r.getRestaurant().getId();
            String restaurantName = r.getRestaurant().getName();

            // Email + notificare pentru creator
            User creator = r.getUser();
            if (creator != null && creator.getEmail() != null) {
                emailService.sendReviewRequestEmail(
                        creator.getEmail(),
                        creator.getFirstName(),
                        restaurantName
                );

                Notification notif = new Notification();
                notif.setRecipient(creator);
                notif.setType("REVIEW_REMINDER");
                notif.setMessage("📝 Ai fost la " + r.getRestaurant().getName() + "? Lasă-ne un review!");
                notif.setTimestamp(LocalDateTime.now());
                notif.setReservationId(r.getId()); // <–– important!
                notif.setRestaurantId(r.getRestaurant().getId());
                notif.setVerificationId(null);
                notificationRepository.save(notif);
                totalSent++;
            }

            // Email + notificare pentru participanți
            for (User participant : r.getParticipants()) {
                if (participant.getEmail() != null) {
                    emailService.sendReviewRequestEmail(
                            participant.getEmail(),
                            participant.getFirstName(),
                            restaurantName
                    );

                    Notification notif = new Notification();
                    notif.setRecipient(participant);
                    notif.setType("REVIEW_REMINDER");
                    notif.setMessage("📝 Ai fost la " + r.getRestaurant().getName() + "? Lasă-ne un review!");
                    notif.setTimestamp(LocalDateTime.now());
                    notif.setReservationId(r.getId()); // <–– important!
                    notif.setRestaurantId(r.getRestaurant().getId());
                    notif.setVerificationId(null);
                    notificationRepository.save(notif);

                    totalSent++;
                }
            }

            // Marcare ca notificat
            r.setNotified(true);
            reservationRepository.save(r);
        }

        System.out.println("📩 Emailuri și notificări de review trimise: " + totalSent);
    }
}
