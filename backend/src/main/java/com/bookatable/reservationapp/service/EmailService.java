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

}
