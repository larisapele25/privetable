package com.bookatable.reservationapp.dto;

import java.util.List;

public record ReservationDTO(
        Long id,
        Long userId,
        String userEmail,
        List<Long> participantIds,
        List<String> participantEmails
) {}
