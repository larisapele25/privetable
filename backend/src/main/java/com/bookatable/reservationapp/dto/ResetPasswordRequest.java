package com.bookatable.reservationapp.dto;

public class ResetPasswordRequest {

    private String code;
    private String newPassword;
    private String confirmPassword;


    public void setCode(String code) {
        this.code = code;
    }
    public String getCode() {return code;}

    public void setNewPassword(String newPassword) {this.newPassword = newPassword;
    }
    public String getNewPassword() {return newPassword;}
     public void setConfirmPassword(String confirmPassword) {this.confirmPassword = confirmPassword;}
    public String getConfirmPassword() {return confirmPassword;}
}
