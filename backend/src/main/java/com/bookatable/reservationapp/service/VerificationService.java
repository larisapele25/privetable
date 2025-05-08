package com.bookatable.reservationapp.service;
import com.bookatable.reservationapp.dto.VerificationRequestDTO;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.model.UserVerification;
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
import java.util.UUID;

@Service
public class VerificationService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserVerificationRepository verificationRepository;

    public UserVerification submitVerification(VerificationRequestDTO dto) throws IOException {
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

        UserVerification saved = verificationRepository.save(verification);

        System.out.println("✅ Verificare salvată pentru userId=" + user.getId());
        return saved;
    }

    private String saveImage(MultipartFile image, String prefix) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                throw new IOException("Nu s-a putut crea directorul de upload.");
            }
        }

        String extension = ".jpg";
        String filename = prefix + "_" + UUID.randomUUID() + extension;
        Path filePath = new File(dir, filename).toPath();

        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Fișier salvat: " + filePath.toAbsolutePath());
        return filePath.toString();
    }
}
