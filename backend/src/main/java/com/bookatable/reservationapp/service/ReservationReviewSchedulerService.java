package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationReviewSchedulerService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 * * * *") // în fiecare oră fix
    @Transactional
    public void sendReviewRequests() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> pastReservations = reservationRepository.findAll().stream()
                .filter(r -> r.getDateTime().plusHours(r.getDuration()).isBefore(now))
                .filter(r -> !Boolean.TRUE.equals(r.isNotified()))
                .toList();

        for (Reservation r : pastReservations) {
            Long reservationId = r.getId();
            Long restaurantId = r.getRestaurant().getId();

            // creatorul rezervării
            if (r.getUser() != null && r.getUser().getEmail() != null) {
                emailService.sendReviewRequestEmail(
                        r.getUser().getEmail(),
                        r.getUser().getFirstName(),
                        r.getRestaurant().getName(),
                        reservationId,
                        r.getUser().getId(),
                        restaurantId
                );
            }

            // participanții
            for (User u : r.getParticipants()) {
                if (u.getEmail() != null) {
                    emailService.sendReviewRequestEmail(
                            u.getEmail(),
                            u.getFirstName(),
                            r.getRestaurant().getName(),
                            reservationId,
                            u.getId(),
                            restaurantId
                    );
                }
            }

            // marchează ca notificată
            r.setNotified(true);
            reservationRepository.save(r);
        }

        System.out.println("📩 Emailuri de review trimise: " + pastReservations.size());
    }




}
