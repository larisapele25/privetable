package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.model.*;
import com.bookatable.reservationapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "*") // pentru acces din frontend
public class InvitationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private InvitationRepository invitationRepository;
    @Autowired
    private NotificationRepository notificationRepository;



    @PostMapping
    public ResponseEntity<?> inviteUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Long reservationId = Long.valueOf(payload.get("reservationId"));

        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Reservation> resOpt = reservationRepository.findById(reservationId);

        if (userOpt.isEmpty() || resOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or reservation not found");
        }

        User user = userOpt.get();
        Reservation reservation = resOpt.get();

        // Verificăm dacă userul a fost deja invitat
        if (invitationRepository.existsByInvitedUserAndReservation(user, reservation)) {
            return ResponseEntity.badRequest().body("User already invited");
        }

        // Verificăm dacă userul este deja participant
        if (reservation.getParticipants().contains(user)) {
            return ResponseEntity.badRequest().body("User already joined");
        }

        // Verificăm limita: participanți + creator
        int totalJoined = reservation.getParticipants().size() + 1; // +1 pentru creator
        int maxPeople = reservation.getNumberOfPeople();

        if (totalJoined >= maxPeople) {
            return ResponseEntity.badRequest().body("Limită de participanți atinsă");
        }

        // Salvăm invitația
        Invitation invitation = new Invitation(user, reservation);
        invitationRepository.save(invitation);

        String formattedDateTime = reservation.getDateTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm"));
        String message = String.format(
                "You have received an invitation for a reservation at %s\nDate: %s\nGuests: %d\nDuration: %d hours",
                reservation.getRestaurant().getName(),
                formattedDateTime,
                reservation.getNumberOfPeople(),
                reservation.getDuration()
        );

        notificationRepository.save(new Notification(message, "INVITE", reservation.getId(), user));

        return ResponseEntity.ok("Invitation sent");
    }



}
