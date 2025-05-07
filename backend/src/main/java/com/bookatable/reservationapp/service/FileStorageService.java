package com.bookatable.reservationapp.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (Exception e) {
            throw new RuntimeException(" Nu pot crea folderul de upload.", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            // Generează un nume valid și unic
            String extension = ".jpg";
            String uniqueName = UUID.randomUUID().toString() + extension;

            //  Creează folderul dacă nu există
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            Path targetLocation = this.fileStorageLocation.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            System.out.println(" Fișier salvat cu succes: " + targetLocation.toString());
            return targetLocation.toString();

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(" Eroare la salvarea fișierului.", e);
        }
    }

}
