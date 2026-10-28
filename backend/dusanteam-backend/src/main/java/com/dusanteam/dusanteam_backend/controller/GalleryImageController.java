package com.dusanteam.dusanteam_backend.controller;

import com.dusanteam.dusanteam_backend.dto.GalleryImageDto;
import com.dusanteam.dusanteam_backend.service.GalleryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryImageController {

    private final GalleryImageService service;

    @GetMapping
    public ResponseEntity<List<GalleryImageDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalleryImageDto> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GalleryImageDto> create(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(file));
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<GalleryImageDto>> createMultiple(@RequestParam("files") MultipartFile[] files) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createMultiple(files));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
