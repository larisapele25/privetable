package com.bookatable.reservationapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReservationappApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReservationappApplication.class, args);
	}

}
