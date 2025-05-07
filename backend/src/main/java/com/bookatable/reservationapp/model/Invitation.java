package com.bookatable.reservationapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User invitedUser;

    @ManyToOne
    private Reservation reservation;

    private boolean accepted = false;

    public Invitation() {}

    public Invitation(User invitedUser, Reservation reservation) {
        this.invitedUser = invitedUser;
        this.reservation = reservation;
        this.accepted = false;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public User getInvitedUser() { return invitedUser; }

    public Reservation getReservation() { return reservation; }

    public boolean isAccepted() { return accepted; }

    public void setAccepted(boolean accepted) { this.accepted = accepted; }
}
