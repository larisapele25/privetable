package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.User;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private boolean verified;

    public UserDTO(Long id, String name, String email, boolean verified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.verified = verified;
    }

    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getFirstName(),user.getEmail(),  user.isVerified());
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isVerified() { return verified; }
}
