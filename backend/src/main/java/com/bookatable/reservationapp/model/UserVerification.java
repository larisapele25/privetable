package com.bookatable.reservationapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "user_verification")
public class UserVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String surname;
    private String cnp;
    private String idNumber;
    private String frontImagePath;
    private String backImagePath;
    private boolean verificationStatus;

    // 🔍 Adăugate pentru validare manuală
    private boolean reviewedByAdmin = false;
    private String adminComment;
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("userVerification")
    private User user;

    public UserVerification() {}

    public UserVerification(String name, String surname, String cnp, String idNumber, String frontImagePath, String backImagePath, boolean verificationStatus) {
        this.name = name;
        this.surname = surname;
        this.cnp = cnp;
        this.idNumber = idNumber;
        this.frontImagePath = frontImagePath;
        this.backImagePath = backImagePath;
        this.verificationStatus = verificationStatus;
    }

    // Getteri și setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getCnp() { return cnp; }
    public void setCnp(String cnp) { this.cnp = cnp; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getFrontImagePath() { return frontImagePath; }
    public void setFrontImagePath(String frontImagePath) { this.frontImagePath = frontImagePath; }

    public String getBackImagePath() { return backImagePath; }
    public void setBackImagePath(String backImagePath) { this.backImagePath = backImagePath; }

    public boolean isVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(boolean verificationStatus) { this.verificationStatus = verificationStatus; }

    public boolean isReviewedByAdmin() { return reviewedByAdmin; }
    public void setReviewedByAdmin(boolean reviewedByAdmin) { this.reviewedByAdmin = reviewedByAdmin; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
