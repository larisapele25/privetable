package com.bookatable.reservationapp.dto;

public class RestaurantInfoDTO {

    private Long id;
    private String name;
    private String imageUrl;
    private String loginCode;
    private int capacity;

    public RestaurantInfoDTO(Long id, int capacity, String name, String imageUrl, String loginCode) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.loginCode = loginCode;
        this.capacity = capacity;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getLoginCode() {
        return loginCode;
    }
    public int getCapacity() {
        return capacity;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public void setLoginCode(String loginCode) {
        this.loginCode = loginCode;
    }
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
