package com.dusanteam.dusanteam_backend.repository;

import com.dusanteam.dusanteam_backend.entity.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {}
