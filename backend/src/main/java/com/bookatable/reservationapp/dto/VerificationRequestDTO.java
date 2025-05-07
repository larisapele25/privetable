package com.bookatable.reservationapp.dto;

import org.springframework.web.multipart.MultipartFile;

public class VerificationRequestDTO {
    private String name;
    private String surname;
    private String cnp;
    private String idNumber;

    private MultipartFile frontImage;
    private MultipartFile backImage;

    private Long userId; // ID-ul utilizatorului care face verificarea

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getCnp() { return cnp; }
    public void setCnp(String cnp) { this.cnp = cnp; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public MultipartFile getFrontImage() { return frontImage; }
    public void setFrontImage(MultipartFile frontImage) { this.frontImage = frontImage; }

    public MultipartFile getBackImage() { return backImage; }
    public void setBackImage(MultipartFile backImage) { this.backImage = backImage; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
