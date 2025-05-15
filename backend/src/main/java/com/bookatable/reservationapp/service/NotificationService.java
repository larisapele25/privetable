package com.bookatable.reservationapp.service;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Product;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ProductRepository;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class NotificationService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final RestaurantRepository restaurantRepository;
    private final ProductRepository productRepository;

    public NotificationService(UserRepository userRepository,
                               NotificationRepository notificationRepository,
                               RestaurantRepository restaurantRepository,
                               ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.restaurantRepository = restaurantRepository;
        this.productRepository = productRepository;
    }

    @Scheduled(cron = "0 0 15 * * *")
public void sendReengagementNotifications() {
    System.out.println("⏰ Jobul de reengagement rulează");

    List<User> users = userRepository.findAll();
    int count = 0;

    for (User user : users) {
        List<Notification> recent = notificationRepository.findByRecipientId(user.getId()).stream()
                .filter(n -> n.getTimestamp().isAfter(LocalDateTime.now().minusDays(7)))
                .toList();

        Optional<Product> randomProduct = productRepository.findAll().stream().findAny();
        if (randomProduct.isEmpty()) continue;

        Product product = randomProduct.get();
        String message = "🍽 Hei! N-ai mai încercat demult " +
                product.getName() + " de la " + product.getRestaurant().getName() + ". Poate revii?";

        Notification notif = new Notification();
        notif.setMessage(message);
        notif.setType("REENGAGEMENT");
        notif.setTimestamp(LocalDateTime.now());
        notif.setRecipient(user);
        notif.setRestaurantId(product.getRestaurant().getId());

        notificationRepository.save(notif);
        count++;
    }

    System.out.println("✅ Notificări REENGAGEMENT salvate: " + count);
}

}

