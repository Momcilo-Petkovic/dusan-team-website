package com.dusanteam.dusanteam_backend.controller;

import com.dusanteam.dusanteam_backend.dto.WebsiteTextDto;
import com.dusanteam.dusanteam_backend.service.WebsiteTextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/texts")
@RequiredArgsConstructor
public class WebsiteTextController {

    private final WebsiteTextService service;

    @GetMapping
    public ResponseEntity<List<WebsiteTextDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Bulk fetch: all texts whose key starts with a prefix (e.g. "about_"),
     * returned as { key: content }. One request instead of 12 for the About page.
     */
    @GetMapping("/page/{prefix}")
    public ResponseEntity<Map<String, String>> getTextsByPage(@PathVariable String prefix) {
        return ResponseEntity.ok(service.findByPrefix(prefix));
    }

    @GetMapping("/{key}")
    public ResponseEntity<WebsiteTextDto> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(service.findByKey(key));
    }

    /** Creates or updates a text. An empty body clears it. */
    @PutMapping("/{key}")
    public ResponseEntity<WebsiteTextDto> updateByKey(
            @PathVariable String key,
            @RequestBody(required = false) String content
    ) {
        return ResponseEntity.ok(service.save(key, content));
    }
}
