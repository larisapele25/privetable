package com.bookatable.reservationapp.dto;

public class RestaurantLoginRequest {
    private String loginCode;
    private String password;

    public String getLoginCode() {
        return loginCode;
    }

    public void setLoginCode(String loginCode) {
        this.loginCode = loginCode;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
