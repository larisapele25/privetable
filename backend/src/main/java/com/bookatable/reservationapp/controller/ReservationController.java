package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.JoinReservationRequest;
import com.bookatable.reservationapp.dto.TimeSlotDTO;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bookatable.reservationapp.dto.ReservationDetailsDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {


    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationService reservationService, UserRepository userRepository, ReservationRepository reservationRepository) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/upcoming")
    public List<ReservationDTO> getUpcomingReservations(@RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return reservationService.getUpcomingReservations(user)
                .stream()
                .map(ReservationDTO::from)
                .toList();
    }

    // DTO pentru răspuns ușor de afișat pe frontend
    public record ReservationDTO(Long id, String restaurantName, String date, String time) {
        public static ReservationDTO from(Reservation res) {
            return new ReservationDTO(
                    res.getId(),
                    res.getRestaurant().getName(),
                    res.getDateTime().toLocalDate().toString(),
                    res.getDateTime().toLocalTime().toString()
            );
        }
    }

    @GetMapping("/availability")
    public List<TimeSlotDTO> getAvailableTimeslots(
            @RequestParam Long restaurantId,
            @RequestParam String date,
            @RequestParam int nrPeople
    ) {
        return reservationService.getAvailableTimeslots(restaurantId, date, nrPeople);
    }


    @PostMapping("/create")

    public ResponseEntity<String> createReservation(
            @RequestParam Long userId,
            @RequestParam Long restaurantId,
            @RequestParam String dateTime,
            @RequestParam int nrPeople,
            @RequestParam int duration
    ) {
        try {
            reservationService.createReservation(userId, restaurantId, dateTime, nrPeople, duration);
            return ResponseEntity.ok("Reservation created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("id", reservation.getId());
        result.put("dateTime", reservation.getDateTime());
        result.put("duration", reservation.getDuration());
        result.put("numberOfPeople", reservation.getNumberOfPeople());
        result.put("restaurantName", reservation.getRestaurant().getName());
        result.put("restaurantId", reservation.getRestaurant().getId());
        result.put("createdById", reservation.getUser().getId());
        List<String> participantEmails = reservation.getParticipants()
                .stream()
                .map(User::getEmail)
                .toList();

        result.put("participants", participantEmails);


        return ResponseEntity.ok(result);
    }
    @PostMapping("/{reservationId}/join")
    public ResponseEntity<?> joinReservation(
            @PathVariable Long reservationId,
            @RequestBody JoinReservationRequest request
    ) {
        Long userId = request.getUserId();
        if (userId == null) {
            throw new RuntimeException("User ID is missing");
        }
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!reservation.getParticipants().contains(user)) {
            reservation.getParticipants().add(user);
            reservationRepository.save(reservation);
        }

        return ResponseEntity.ok("Joined");
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelReservation(
            @PathVariable Long id,
            @RequestParam Long userId // sau extragi din JWT dacă ai autentificare
    ) {
        reservationService.cancelReservation(id, userId);
        return ResponseEntity.ok("Rezervarea a fost anulată");
    }




}
