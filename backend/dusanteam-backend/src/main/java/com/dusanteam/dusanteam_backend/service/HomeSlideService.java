package com.dusanteam.dusanteam_backend.service;

import com.dusanteam.dusanteam_backend.entity.HomeSlide;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface HomeSlideService {

    List<HomeSlide> findAll();

    HomeSlide findById(Long id);

    HomeSlide create(String text, MultipartFile file) throws IOException;

    HomeSlide update(Long id, String text, MultipartFile file) throws IOException;

    void delete(Long id);
}
