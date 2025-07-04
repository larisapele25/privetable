package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ProductDTO;
import com.bookatable.reservationapp.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductDTO> getProducts(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        return productService.getProductsByRestaurant(restaurantId);
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO dto, HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.addProduct(restaurantId, dto);
        return ResponseEntity.ok("Product added");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto, HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.updateProduct(id, restaurantId, dto);
        return ResponseEntity.ok("Product updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        productService.deleteProduct(id, restaurantId);
        return ResponseEntity.ok("Product deleted");
    }
}
