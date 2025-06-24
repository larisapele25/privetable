package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.User;

public class FoundUserDTO {

    private Long id;
    private String inviting;

    public FoundUserDTO(User user) {
        this.id = user.getId();
        this.inviting = user.getFirstName() + " " + user.getLastName();
    }

    public Long getId() {
        return id;
    }

    public String getInviting() {
        return inviting;
    }
}
