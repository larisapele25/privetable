package com.bookatable.reservationapp.controller;

import com.bookatable.reservationapp.dto.ProductDTO;
import com.bookatable.reservationapp.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class PublicProductController {

    private final ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/restaurant/{id}")
    public List<ProductDTO> getProductsForRestaurant(@PathVariable Long id) {
        return productService.getProductsByRestaurant(id);
    }
}

