package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.dto.VerificationRequestDTO;
import com.bookatable.reservationapp.model.Notification;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.model.UserVerification;
import com.bookatable.reservationapp.repository.NotificationRepository;
import com.bookatable.reservationapp.repository.UserRepository;
import com.bookatable.reservationapp.repository.UserVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserVerificationRepository verificationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public void submitVerification(VerificationRequestDTO dto) throws IOException {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Salvează imaginile cu nume sigure
        String frontPath = saveImage(dto.getFrontImage(), "front_" + user.getId());
        String backPath = saveImage(dto.getBackImage(), "back_" + user.getId());

        // Construiește obiectul de verificare
        UserVerification verification = new UserVerification();
        verification.setName(dto.getName());
        verification.setSurname(dto.getSurname());
        verification.setCnp(dto.getCnp());
        verification.setIdNumber(dto.getIdNumber());
        verification.setFrontImagePath(frontPath);
        verification.setBackImagePath(backPath);
        verification.setVerificationStatus(false);
        verification.setReviewedByAdmin(false);
        verification.setUser(user);

        verificationRepository.save(verification);

        // Notificare: verificare în curs
        Notification noti = new Notification();
        noti.setRecipient(user);
        noti.setType("VERIFICATION");
        noti.setMessage("Verificarea contului este în curs. Poate dura până la 24h.");
        noti.setTimestamp(LocalDateTime.now());

        notificationRepository.save(noti);

        System.out.println("✅ Verificare salvată pentru userId=" + user.getId());
    }

    private String saveImage(MultipartFile image, String prefix) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                throw new IOException("Nu s-a putut crea directorul de upload.");
            }
        }

        String extension = ".jpg"; // Poți extrage și din `image.getOriginalFilename()` dacă vrei
        String filename = prefix + "_" + UUID.randomUUID() + extension;
        Path filePath = new File(dir, filename).toPath();

        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Fișier salvat: " + filePath.toAbsolutePath());
        return filePath.toString();
    }
}
