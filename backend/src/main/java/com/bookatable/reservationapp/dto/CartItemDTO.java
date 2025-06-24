package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.CartItem;
import com.bookatable.reservationapp.model.Product;

public class CartItemDTO {
    private Long id;
    private Integer quantity;
    private ProductDTO product;
    private UserDTO user;

    public CartItemDTO(CartItem item) {
        this.id = item.getId();
        this.quantity = item.getQuantity();

        Product p = item.getProduct();
        this.product = new ProductDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                p.getCreatedAt()
        );

        this.user = UserDTO.from(item.getUser());
    }

    public Long getId() {
        return id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public UserDTO getUser() {
        return user;
    }
}
