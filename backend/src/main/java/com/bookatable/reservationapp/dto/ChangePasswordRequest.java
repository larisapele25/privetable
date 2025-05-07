package com.bookatable.reservationapp.dto;


public class ChangePasswordRequest {
    private Long userId;
    private String currentPassword;
    private String newPassword;

    public Long getUserId() {
        return userId;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
    public void setUserId(Long userId) {this.userId = userId;}
    public void setCurrentPassword(String currentPassword) {this.currentPassword = currentPassword;}
    public void setNewPassword(String newPassword) {this.newPassword = newPassword;}
}

