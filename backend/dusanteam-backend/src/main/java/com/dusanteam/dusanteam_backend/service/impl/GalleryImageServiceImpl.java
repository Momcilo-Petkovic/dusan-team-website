package com.dusanteam.dusanteam_backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dusanteam.dusanteam_backend.dto.GalleryImageDto;
import com.dusanteam.dusanteam_backend.entity.GalleryImage;
import com.dusanteam.dusanteam_backend.exception.NotFoundException;
import com.dusanteam.dusanteam_backend.repository.GalleryImageRepository;
import com.dusanteam.dusanteam_backend.service.GalleryImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GalleryImageServiceImpl implements GalleryImageService {

    private static final String FOLDER = "dusan-team";

    private final GalleryImageRepository repository;
    private final Cloudinary cloudinary;

    private GalleryImageDto toDto(GalleryImage image) {
        return GalleryImageDto.builder()
                .id(image.getId())
                .url(image.getUrl())
                .uploadedAt(image.getUploadedAt())
                .build();
    }

    private void requireCloudinary() {
        String name = cloudinary.config.cloudName;
        if (name == null || name.isBlank()) {
            throw new IllegalStateException("Image uploads are not configured: set the Cloudinary keys");
        }
    }

    @Override
    public List<GalleryImageDto> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public Optional<GalleryImageDto> findById(Long id) {
        return repository.findById(id).map(this::toDto);
    }

    @Override
    public GalleryImageDto create(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No image selected");
        }
        requireCloudinary();
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", FOLDER)
            );

            GalleryImage image = GalleryImage.builder()
                    .url(uploadResult.get("secure_url").toString())
                    .publicId(uploadResult.get("public_id").toString())
                    .build();

            return toDto(repository.save(image));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public List<GalleryImageDto> createMultiple(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No images selected");
        }
        return Arrays.stream(files).map(this::create).toList();
    }

    @Override
    public void delete(Long id) {
        GalleryImage image = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Image " + id + " not found"));

        // Remove the file from Cloudinary too, so it doesn't use storage forever
        if (image.getPublicId() != null && !image.getPublicId().isBlank()) {
            try {
                cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
            } catch (Exception e) {
                // The image should still disappear from the website
                log.warn("Could not delete {} from Cloudinary: {}", image.getPublicId(), e.getMessage());
            }
        }
        repository.delete(image);
    }
}
