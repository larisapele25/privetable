package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByTimestampDesc(Long userId);
    int countByRecipientIdAndReadFalse(Long userId);
    List<Notification> findByRecipientIdAndReadFalse(Long userId);
    List<Notification> findByRecipientId(Long userId);

    List<Notification> findByRecipientIdAndDeletedFalseOrderByTimestampDesc(Long userId);
}
