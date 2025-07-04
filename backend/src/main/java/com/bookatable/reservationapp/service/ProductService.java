package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.ProductDTO;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.Product;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.CartItemRepository;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.ProductRepository;
import com.bookatable.reservationapp.repository.RestaurantRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final RestaurantRepository restaurantRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ProductService(ProductRepository productRepository,
                          RestaurantRepository restaurantRepository,
                          CartItemRepository cartItemRepository,
                          UserRepository userRepository,
                          NotificationRepository notificationRepository) {
        this.productRepository = productRepository;
        this.restaurantRepository = restaurantRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    //  Returnează toate produsele sub formă de DTO
    public List<ProductDTO> getProductsByRestaurant(Long restaurantId) {
        return productRepository.findByRestaurantId(restaurantId).stream()
                .map(p -> new ProductDTO(
                                        p.getId(),
                                        p.getName(),
                                        p.getDescription(),
                                        p.getPrice(),
                                        p.getCategory(),
                                        p.getCreatedAt()))
                .toList();
    }

    //  Adaugă un produs nou și notifică toți utilizatorii
    public void addProduct(Long restaurantId, ProductDTO dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getCategory(),
                restaurant
        );

        productRepository.save(product);

        // Trimite notificare tuturor userilor
        String message = "Restaurant " + restaurant.getName() + " has updated its menu!";

        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setType("MENU_UPDATE");
            notification.setTimestamp(LocalDateTime.now());
            notification.setRecipient(user);
            notification.setRestaurantId(restaurant.getId());
            notificationRepository.save(notification);
        }
    }

    //  Actualizează un produs dacă aparține restaurantului logat
    public void updateProduct(Long productId, Long restaurantId, ProductDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Unauthorized");
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());

        productRepository.save(product);
    }

    //  Șterge un produs dacă aparține restaurantului logat
    public void deleteProduct(Long productId, Long restaurantId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!cartItemRepository.findByProductId(productId).isEmpty()) {
            throw new RuntimeException("The product is included in orders and cannot be deleted.");
        }

        if (!product.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Unauthorized");
        }

        productRepository.delete(product);
    }
}
