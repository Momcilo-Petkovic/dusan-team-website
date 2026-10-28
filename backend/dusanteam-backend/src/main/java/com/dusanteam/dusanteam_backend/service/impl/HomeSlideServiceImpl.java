package com.dusanteam.dusanteam_backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dusanteam.dusanteam_backend.entity.HomeSlide;
import com.dusanteam.dusanteam_backend.exception.NotFoundException;
import com.dusanteam.dusanteam_backend.repository.HomeSlideRepository;
import com.dusanteam.dusanteam_backend.service.HomeSlideService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeSlideServiceImpl implements HomeSlideService {

    public static final int MAX_SLIDES = 4;
    private static final String FOLDER = "home_slides";

    private final HomeSlideRepository repository;
    private final Cloudinary cloudinary;

    private void requireCloudinary() {
        String name = cloudinary.config.cloudName;
        if (name == null || name.isBlank()) {
            throw new IllegalStateException("Image uploads are not configured: set the Cloudinary keys");
        }
    }

    private Map<?, ?> upload(MultipartFile file) throws IOException {
        requireCloudinary();
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", FOLDER));
    }

    private void deleteFromCloudinary(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            log.warn("Could not delete {} from Cloudinary: {}", publicId, e.getMessage());
        }
    }

    private static void checkText(String text) {
        if (text != null && text.length() > 500) {
            throw new IllegalArgumentException("Slide text is too long (max 500 characters)");
        }
    }

    @Override
    public List<HomeSlide> findAll() {
        return repository.findAllByOrderByIdAsc();
    }

    @Override
    public HomeSlide findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Slide " + id + " not found"));
    }

    @Override
    public HomeSlide create(String text, MultipartFile file) throws IOException {
        checkText(text);
        if (repository.count() >= MAX_SLIDES) {
            throw new IllegalArgumentException("Maximum of " + MAX_SLIDES + " slides allowed");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A new slide needs an image");
        }

        Map<?, ?> uploaded = upload(file);
        HomeSlide slide = HomeSlide.builder()
                .text(text)
                .imageUrl(uploaded.get("secure_url").toString())
                .imagePublicId(uploaded.get("public_id").toString())
                .build();

        return repository.save(slide);
    }

    @Override
    public HomeSlide update(Long id, String text, MultipartFile file) throws IOException {
        checkText(text);
        HomeSlide slide = findById(id);
        slide.setText(text);

        if (file != null && !file.isEmpty()) {
            // Upload the new image first, so a failed upload never leaves the slide without one
            Map<?, ?> uploaded = upload(file);
            String oldPublicId = slide.getImagePublicId();
            slide.setImageUrl(uploaded.get("secure_url").toString());
            slide.setImagePublicId(uploaded.get("public_id").toString());
            deleteFromCloudinary(oldPublicId);
        }

        return repository.save(slide);
    }

    @Override
    public void delete(Long id) {
        HomeSlide slide = findById(id);
        deleteFromCloudinary(slide.getImagePublicId());
        repository.delete(slide);
    }
}
