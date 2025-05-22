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
            System.out.println(" Trimit email către: " + to + " cu codul: " + code);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Resetare parolă - BookApp");
        message.setText("Codul tău de resetare este: " + code + "\n\nAcest cod este valabil timp de 15 minute.");

        mailSender.send(message);
    }
    public void sendReservationReminderEmail(String to, String name, String restaurant, String time) {
        System.out.println("🔔 Trimit reminder către: " + to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reminder rezervare - PrivéTable");
        message.setText(
                "Hei " + name + ",\n\n" +
                        "Ai o rezervare la restaurantul " + restaurant + " azi la ora " + time + ".\n" +
                        "Dacă vrei să anulezi sau să reprogramezi, intră în aplicație.\n\n" +
                        "Echipa PrivéTable"
        );
        mailSender.send(message);
    }

    public void sendReviewRequestEmail(String to, String name, String restaurantName, Long reservationId, Long userId, Long restaurantId) {
        System.out.println("📨 Trimit cerere review către: " + to);

        // Construiește linkul de tip deep link (pentru aplicație mobilă)
        String reviewLink = "https://larisapele25.github.io/review-link/" +
                "?reservationId=" + reservationId +
                "&userId=" + userId +
                "&restaurantId=" + restaurantId;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Cum ți s-a părut experiența ta? ✨");
        message.setText(
                "Salut " + name + ",\n\n" +
                        "Ne bucurăm că ai ales serviciile PrivéTable!\n" +
                        "Ai avut o rezervare la " + restaurantName + " și ne-ar plăcea să aflăm cum a fost.\n\n" +
                        "👉 Apasă aici pentru a da un review: " + reviewLink + "\n\n" +
                        "Poți alege între 1–5 stele și adăuga un comentariu.\n\n" +
                        "Mulțumim că ești cu noi!\n" +
                        "Echipa PrivéTable 💜"
        );
        mailSender.send(message);
    }



}
