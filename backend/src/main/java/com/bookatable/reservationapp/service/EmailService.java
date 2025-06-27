package com.bookatable.reservationapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetCodeEmail(String to, String code) {
        System.out.println(" Trimit email resetare către: " + to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reset password - PrivéTable\n");
        message.setText("Your reset code is: " + code + "\n\nThis code is valid for 15 minutes.");
        mailSender.send(message);
    }

    public void sendReservationReminderEmail(String to, String name, String restaurant, String time) {
        System.out.println(" Trimit reminder către: " + to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reservation reminder - PrivéTable");
        message.setText(
                "Hi " + name + ",\n\n" +
                        "You have a reservation at the  " + restaurant + " today at " + time + ".\n" +
                        "If you want to cancel or reschedule, go to the app.\n\n" +
                        "PrivéTable Team"
        );
        mailSender.send(message);
    }

    public void sendReviewRequestEmail(String to, String name, String restaurantName) {
        System.out.println(" Trimit cerere review către: " + to);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("How was your experience? ✨");
        message.setText(
                "Hi " + name + ",\n\n" +
                        "We are glad you chose PrivéTable services!\n" +
                        "You had a reservation at " + restaurantName + " and we would love to know how it was.\n\n" +
                        "Open the PrivéTable app and leave us a review.\n\n" +
                        "Thank you for being with us!\n" +
                        "PrivéTable Team "
        );

        mailSender.send(message);
        System.out.println("📤 Email trimis cu succes către: " + to);
    }

    public void sendReviewReceivedEmail(String to, String userName, String restaurantName, int rating, String comment) {
        System.out.println(" Trimit email de review primit către: " + to);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Ai primit un review nou de la " + restaurantName + " 📝");
        message.setText(
                "Hi " + userName + ",\n\n" +
                        "You received a new review from the restaurant " + restaurantName + ":\n\n" +
                        "⭐ Rating: " + rating + " stars\n" +
                        "💬 Comment: " + (comment != null && !comment.isEmpty() ? comment : "(no comment)") + "\n\n" +
                        "We're glad you're using PrivéTable!\n\n" +
                        "PrivéTable Team"
        );

        mailSender.send(message);
        System.out.println("📤 Email de review trimis către: " + to);
    }


}
