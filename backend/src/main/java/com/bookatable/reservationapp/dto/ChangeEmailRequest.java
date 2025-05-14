package com.bookatable.reservationapp.dto;

public class ChangeEmailRequest {
    private Long userId;
    private String newEmail;
    private String confirmEmail;
    private String password;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getNewEmail() {
        return newEmail;
    }
    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
    public String getConfirmEmail() {
        return confirmEmail;
    }
    public void setConfirmEmail(String confirmEmail) {
        this.confirmEmail = confirmEmail;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

}

