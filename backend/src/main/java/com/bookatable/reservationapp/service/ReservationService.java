package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.ReservationDetailsDTO;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bookatable.reservationapp.dto.TimeSlotDTO;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.IntStream;
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;

    @Autowired
    private EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository, RestaurantRepository restaurantRepository) {
        this.reservationRepository = reservationRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public ReservationDetailsDTO getReservationDetails(Long id) {
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isPresent()) {
            Reservation res = optional.get();
            return new ReservationDetailsDTO(
                    res.getRestaurant().getName(),
                    res.getDateTime(),
                    res.getNumberOfPeople(),
                    res.getDuration(),
                    res.getUser().getId()
            );
        } else {
            throw new RuntimeException("Reservation not found");
        }
    }
    // Upcoming reservations
   // public List<Reservation> getUpcomingReservations(User user) {
     //   return reservationRepository.findUpcomingReservationsForUser(user, LocalDateTime.now());
    //}


    public List<Reservation> getUpcomingReservations(User user) {
        List<Reservation> all = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> created = reservationRepository.findByUser(user);
        List<Reservation> joined = reservationRepository.findByParticipantsContaining(user);

        for (Reservation r : created) {
            if (isStillUpcoming(r, now)) {
                all.add(r);
            }
        }

        for (Reservation r : joined) {
            if (isStillUpcoming(r, now) && !all.contains(r)) {
                all.add(r);
            }
        }

        return all;
    }

    private boolean isStillUpcoming(Reservation r, LocalDateTime now) {
        int duration = Optional.of(r.getDuration()).orElse(1);
        return r.getDateTime().plusHours(duration).isAfter(now);
    }

    // Past reservations (pentru Book Again)
    public List<Reservation> getPastReservations(User user) {
        return reservationRepository.findByUserAndDateTimeBefore(user, LocalDateTime.now());
    }




    public List<TimeSlotDTO> getAvailableTimeslots(Long restaurantId, String dateStr, int nrPeople) {
        final int MAX_SEATS = 20;
        final int MAX_DURATION = 3; // cât permitem cel mult

        LocalDate date = LocalDate.parse(dateStr);
        List<Reservation> reservations = reservationRepository.findByRestaurantIdAndDate(restaurantId, date);

        // toate orele din zi (10:00 - 21:00)
        List<LocalTime> allTimes = IntStream.rangeClosed(10, 21)
                .mapToObj(hour -> LocalTime.of(hour, 0))
                .toList();

        // ocupare pe fiecare oră
        Map<LocalTime, Integer> occupiedSeats = new HashMap<>();
        for (int hour = 10; hour <= 21; hour++) {
            occupiedSeats.put(LocalTime.of(hour, 0), 0);
        }

        for (Reservation res : reservations) {
            LocalDateTime start = res.getDateTime();
            int duration = Optional.ofNullable(res.getDuration()).orElse(1);
            LocalDateTime end = start.plusHours(duration);



            for (int h = start.getHour(); h < end.getHour(); h++) {
                LocalTime slot = LocalTime.of(h, 0);
                occupiedSeats.merge(slot, res.getNumberOfPeople(), Integer::sum);
            }
        }

        // Returnăm fiecare oră și durata maximă permisă
        return allTimes.stream()
                .map(time -> {
                    int maxPossibleDuration = 0;

                    for (int d = 1; d <= MAX_DURATION; d++) {
                        boolean fits = true;

                        for (int i = 0; i < d; i++) {
                            LocalTime checkTime = time.plusHours(i);
                            if (checkTime.isAfter(LocalTime.of(21, 0))) {
                                fits = false;
                                break;
                            }
                            int total = occupiedSeats.getOrDefault(checkTime, 0) + nrPeople;
                            if (total > MAX_SEATS) {
                                fits = false;
                                break;
                            }
                        }

                        if (fits) {
                            maxPossibleDuration = d;
                        } else {
                            break;
                        }
                    }

                    return new TimeSlotDTO(time.toString(), maxPossibleDuration);
                })
                .filter(ts -> ts.getMaxDuration() > 0)
                .toList();
    }



    @Autowired
    private UserRepository userRepository;

    public void createReservation(Long userId, Long restaurantId, String dateTimeStr, int nrPeople, int duration) {
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr); // Ex: "2025-04-10T17:00"
        LocalDate date = dateTime.toLocalDate();

        User user = userRepository.findById(userId).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow();

        // 🔁 1. Verificare suprapunere rezervări EXISTENTE ale utilizatorului
        List<Reservation> userReservations = reservationRepository.findByUserAndDateTimeBetween(
                user,
                date.atStartOfDay(),
                date.atTime(23, 59)
        );

        LocalDateTime newStart = dateTime;
        LocalDateTime newEnd = dateTime.plusHours(duration);

        for (Reservation res : userReservations) {
            LocalDateTime existingStart = res.getDateTime();
            LocalDateTime existingEnd = existingStart.plusHours(res.getDuration());

            boolean overlap = newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
            if (overlap) {
                throw new RuntimeException("You already have another reservation that overlaps this time.");
            }
        }

        // 🔁 2. Verificare capacitate pentru restaurant (așa cum aveai deja)
        List<Reservation> existingReservations = reservationRepository.findByRestaurantIdAndDate(restaurantId, date);
        int MAX_SEATS = 20;
        int seatsTaken = 0;

        for (Reservation res : existingReservations) {
            LocalDateTime existingStart = res.getDateTime();
            LocalDateTime existingEnd = existingStart.plusHours(res.getDuration());

            boolean overlaps = newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
            if (overlaps) {
                seatsTaken += res.getNumberOfPeople();
            }
        }

        if (seatsTaken + nrPeople > MAX_SEATS) {
            throw new RuntimeException("Not enough seats available at this hour.");
        }

        // ✅ 3. Creează rezervarea
        Reservation reservation = new Reservation(dateTime, user, restaurant, nrPeople, duration);
        reservationRepository.save(reservation);
    }

    @Scheduled(fixedRate = 60 * 60 * 1000) // la fiecare oră
    public void sendUpcomingReservationReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in2Hours = now.plusHours(2);

        List<Reservation> upcoming = reservationRepository
                .findByDateTimeBetweenAndNotifiedFalse(now, in2Hours);

        for (Reservation res : upcoming) {
            User user = res.getUser();
            String restaurantName = res.getRestaurant().getName();
            String time = res.getDateTime().toLocalTime().toString();

            emailService.sendReservationReminderEmail(
                    user.getEmail(),
                    user.getFirstName(),
                    restaurantName,
                    time
            );


            res.setNotified(true);
            reservationRepository.save(res);
        }
    }

    public void cancelReservation(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Rezervarea nu există"));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new RuntimeException("Doar creatorul poate anula această rezervare");
        }

        if (reservation.getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Rezervarea a trecut deja și nu mai poate fi anulată");
        }
        if (reservation.getDateTime().minusHours(2).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Rezervarea poate fi anulată doar cu minim 2 ore înainte.");
        }


        // aici poți avea și un câmp status (ex: "CANCELLED"), dar pentru simplitate:
        reservationRepository.delete(reservation);
    }

    public List<Reservation> getForRestaurant(Long restaurantId) {
        return reservationRepository.findByRestaurantId(restaurantId);
    }

    public List<ReservationDetailsDTO> getReservationDetailsForRestaurant(Long restaurantId) {
        List<Reservation> reservations = reservationRepository.findByRestaurantId(restaurantId);

        return reservations.stream()
                .map(res -> new ReservationDetailsDTO(
                        res.getRestaurant().getName(),
                        res.getDateTime(),
                        res.getNumberOfPeople(),
                        res.getDuration(),
                        res.getUser().getId()
                ))
                .toList();
    }
    public List<ReservationDetailsDTO> getReservationsForDate(Long restaurantId, LocalDate date) {
        return reservationRepository.findByRestaurantIdAndDateExact(restaurantId, date).stream()
                .map(res -> new ReservationDetailsDTO(
                        res.getRestaurant().getName(),
                        res.getDateTime(),
                        res.getNumberOfPeople(),
                        res.getDuration(),
                        res.getUser().getId()
                )).toList();
    }



}
