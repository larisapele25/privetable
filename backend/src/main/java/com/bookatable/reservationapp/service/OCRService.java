package com.bookatable.reservationapp.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    private static final String TESSDATA_PATH = "/opt/homebrew/share/tessdata";
    private static final String LANGUAGE = "ron";

    public String extractTextFromImage(String imagePath) {
        try {
            File imageFile = new File(imagePath);
            ITesseract instance = new Tesseract();
            instance.setDatapath(TESSDATA_PATH);
            instance.setLanguage(LANGUAGE);

            String ocrText = instance.doOCR(imageFile);

            System.out.println("----- TEXT EXTRAS DIN IMAGINE -----");
            System.out.println(ocrText);
            System.out.println("----- SFÂRȘIT TEXT OCR -----");

            return ocrText;
        } catch (TesseractException e) {
            e.printStackTrace();
            return "";
        } catch (Exception e) {
            System.err.println("Eroare la OCR: " + e.getMessage());
            return "";
        }
    }

    public Map<String, String> extractFieldsFromOcr(String ocrText) {
        Map<String, String> fields = new HashMap<>();

        //  CNP din linia care conține „CNP”
        Matcher cnpLineMatcher = Pattern.compile("(?i)CNP[^\\d]*(\\d{13})").matcher(ocrText);
        if (cnpLineMatcher.find()) {
            fields.put("cnp", cnpLineMatcher.group(1));
        }

        //  Fallback: 13 cifre oriunde
        if (!fields.containsKey("cnp")) {
            Matcher cnpMatcher = Pattern.compile("\\b\\d{13}\\b").matcher(ocrText);
            if (cnpMatcher.find()) {
                fields.put("cnp", cnpMatcher.group());
            }
        }

        //  Nume + Prenume din MRZ (IDROU...)
        Matcher mrzMatcher = Pattern.compile("IDROU[A-Z0-9<]+").matcher(ocrText);
        if (mrzMatcher.find()) {
            String mrz = mrzMatcher.group().replace("IDROU", "");
            String[] parts = mrz.split("<<");

            if (parts.length >= 2) {
                String surname = parts[0].replace("<", " ").trim();
                String prenume = parts[1].replace("<", " ").replaceAll("\\s+", " ").trim();

                fields.put("surname", surname);
                fields.put("name", prenume);
            }
        }

        //  ID din linia a doua MRZ — ex: ZH310845<
        Matcher secondMrzLineMatcher = Pattern.compile("(?m)^([A-Z]{2}\\d{6})<").matcher(ocrText);
        if (secondMrzLineMatcher.find()) {
            fields.put("id", secondMrzLineMatcher.group(1));
        }

        //  Fallback pentru ID dacă nu apare în MRZ
        if (!fields.containsKey("id")) {
            Matcher idMatcher = Pattern.compile("\\b[A-Z]{2}\\s?\\d{6}\\b").matcher(ocrText);
            if (idMatcher.find()) {
                fields.put("id", idMatcher.group().replaceAll("\\s+", ""));
            }
        }

        //  Fallback pentru nume și prenume (dacă nu e MRZ valid)
        if (!fields.containsKey("surname")) {
            Matcher lastNameMatcher = Pattern.compile("(?i)\\bNume\\b[^\\n\\r:]*[:\\s]+([A-ZĂÂÎȘȚa-zăâîșț\\-]+)").matcher(ocrText);
            if (lastNameMatcher.find()) {
                fields.put("surname", lastNameMatcher.group(1).trim());
            }
        }

        if (!fields.containsKey("name")) {
            Matcher firstNameMatcher = Pattern.compile("(?i)\\bPrenume\\b[^\\n\\r:]*[:\\s]+([A-ZĂÂÎȘȚa-zăâîșț\\- ]+)").matcher(ocrText);
            if (firstNameMatcher.find()) {
                fields.put("name", firstNameMatcher.group(1).trim());
            }
        }

        return fields;
    }
}
