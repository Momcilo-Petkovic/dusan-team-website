package com.dusanteam.dusanteam_backend.service.impl;

import com.dusanteam.dusanteam_backend.dto.WebsiteTextDto;
import com.dusanteam.dusanteam_backend.entity.WebsiteText;
import com.dusanteam.dusanteam_backend.exception.NotFoundException;
import com.dusanteam.dusanteam_backend.repository.WebsiteTextRepository;
import com.dusanteam.dusanteam_backend.service.WebsiteTextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WebsiteTextServiceImpl implements WebsiteTextService {

    /** Keys look like "about_title" or "about_feature_1_desc" */
    private static final Pattern KEY = Pattern.compile("[a-z0-9_]{1,100}");

    private final WebsiteTextRepository repository;

    private WebsiteTextDto toDto(WebsiteText text) {
        return WebsiteTextDto.builder()
                .id(text.getId())
                .key(text.getTextKey())
                .content(text.getContent())
                .build();
    }

    @Override
    public List<WebsiteTextDto> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public Map<String, String> findByPrefix(String prefix) {
        return repository.findByTextKeyStartingWith(prefix).stream()
                .collect(Collectors.toMap(
                        WebsiteText::getTextKey,
                        WebsiteText::getContent,
                        (existing, duplicate) -> existing
                ));
    }

    @Override
    public WebsiteTextDto findByKey(String key) {
        return repository.findByTextKey(key)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Text not found for key: " + key));
    }

    /** Creates the text the first time it's saved, so a fresh database works out of the box. */
    @Override
    public WebsiteTextDto save(String key, String content) {
        if (!KEY.matcher(key).matches()) {
            throw new IllegalArgumentException("Invalid text key: " + key);
        }
        WebsiteText text = repository.findByTextKey(key)
                .orElseGet(() -> WebsiteText.builder().textKey(key).build());
        text.setContent(content == null ? "" : content);
        return toDto(repository.save(text));
    }
}
