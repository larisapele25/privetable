package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.UserVerification;

public class VerificationResponseDTO {

    private Long id;
    private Long userId;
    private String name;
    private String surname;
    private String cnp;
    private String idNumber;
    private String frontImagePath;
    private String backImagePath;
    private boolean verificationStatus;
    private boolean reviewedByAdmin;
    private String adminComment;

    public VerificationResponseDTO(UserVerification v) {
        this.id = v.getId();
        this.userId = v.getUser() != null ? v.getUser().getId() : null;
        this.name = v.getName();
        this.surname = v.getSurname();
        this.cnp = v.getCnp();
        this.idNumber = v.getIdNumber();
        this.frontImagePath = v.getFrontImagePath();
        this.backImagePath = v.getBackImagePath();
        this.verificationStatus = v.isVerificationStatus();
        this.reviewedByAdmin = v.isReviewedByAdmin();
        this.adminComment = v.getAdminComment();
    }

    // Getters only (nu ai nevoie de setters la response)
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getSurname() { return surname; }
    public String getCnp() { return cnp; }
    public String getIdNumber() { return idNumber; }
    public String getFrontImagePath() { return frontImagePath; }
    public String getBackImagePath() { return backImagePath; }
    public boolean isVerificationStatus() { return verificationStatus; }
    public boolean isReviewedByAdmin() { return reviewedByAdmin; }
    public String getAdminComment() { return adminComment; }
}
