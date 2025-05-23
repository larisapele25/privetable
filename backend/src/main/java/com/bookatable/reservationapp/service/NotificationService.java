package com.bookatable.reservationapp.service;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Product;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ProductRepository;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Scheduled(cron = "0 0 15 */3 * *") // Rulează la ora 15:00 o dată la 3 zile
    public void sendReengagementNotifications() {
        System.out.println("⏰ Jobul de reengagement rulează");

        List<User> users = userRepository.findAll();
        int count = 0;

        for (User user : users) {
            // Nu trimitem notificare dacă userul a primit deja una în ultimele 2 zile
            List<Notification> recent = notificationRepository.findByRecipientId(user.getId()).stream()
                    .filter(n -> n.getTimestamp().isAfter(LocalDateTime.now().minusDays(2)))
                    .toList();

            boolean alreadySent = recent.stream().anyMatch(n -> "REENGAGEMENT".equals(n.getType()));
            if (alreadySent) continue;

            if (!user.getFavoriteRestaurants().isEmpty()) {
                List<Restaurant> favoriteList = new ArrayList<>(user.getFavoriteRestaurants());
                Restaurant restaurant = favoriteList.get(new Random().nextInt(favoriteList.size()));

                String message = "🍽 Come back to " + restaurant.getName() +
                        " – your favorite menu awaits you!";

                Notification notif = new Notification();
                notif.setMessage(message);
                notif.setType("REENGAGEMENT");
                notif.setTimestamp(LocalDateTime.now());
                notif.setRecipient(user);
                notif.setRestaurantId(restaurant.getId());

                notificationRepository.save(notif);
                count++;
                continue;
            }

        }
    }
}
