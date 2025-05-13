package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ProductDTO;
import com.bookatable.reservationapp.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant-panel/products")
public class RestaurantProductController {

    private final ProductService productService;

    public RestaurantProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        return ResponseEntity.ok(productService.getProductsByRestaurant(restaurantId));
    }

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest request, @RequestBody ProductDTO dto) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.addProduct(restaurantId, dto);
        return ResponseEntity.ok("Product created");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(HttpServletRequest request, @PathVariable Long id, @RequestBody ProductDTO dto) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.updateProduct(id, restaurantId, dto);
        return ResponseEntity.ok("Product updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(HttpServletRequest request, @PathVariable Long id) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.deleteProduct(id, restaurantId);
        return ResponseEntity.ok("Product deleted");
    }
}
