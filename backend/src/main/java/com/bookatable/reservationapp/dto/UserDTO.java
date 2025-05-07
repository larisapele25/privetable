package com.bookatable.reservationapp.dto;

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

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isVerified() { return verified; }
}
