package com.dusanteam.dusanteam_backend.controller;

import com.dusanteam.dusanteam_backend.dto.HomeSlideDto;
import com.dusanteam.dusanteam_backend.entity.HomeSlide;
import com.dusanteam.dusanteam_backend.service.HomeSlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/slides")
@RequiredArgsConstructor
public class HomeSlideController {

    private final HomeSlideService service;

    @GetMapping
    public List<HomeSlideDto> getAll() {
        return service.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping(consumes = "multipart/form-data")
    public HomeSlideDto create(
            @RequestParam(value = "text", defaultValue = "") String text,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        return toDto(service.create(text, file));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public HomeSlideDto update(
            @PathVariable Long id,
            @RequestParam(value = "text", defaultValue = "") String text,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        return toDto(service.update(id, text, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private HomeSlideDto toDto(HomeSlide s) {
        return HomeSlideDto.builder()
                .id(s.getId())
                .text(s.getText())
                .imageUrl(s.getImageUrl())
                .build();
    }
}
