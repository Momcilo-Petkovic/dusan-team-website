package com.dusanteam.dusanteam_backend.service;

import com.dusanteam.dusanteam_backend.dto.GalleryImageDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface GalleryImageService {

    List<GalleryImageDto> findAll();
    Optional<GalleryImageDto> findById(Long id);
    GalleryImageDto create(MultipartFile file);
    List<GalleryImageDto> createMultiple(MultipartFile[] files);
    void delete(Long id);
}
