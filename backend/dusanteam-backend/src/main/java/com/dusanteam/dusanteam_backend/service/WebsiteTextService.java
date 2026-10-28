package com.dusanteam.dusanteam_backend.service;

import com.dusanteam.dusanteam_backend.dto.WebsiteTextDto;

import java.util.List;
import java.util.Map;

public interface WebsiteTextService {
    List<WebsiteTextDto> findAll();
    Map<String, String> findByPrefix(String prefix);
    WebsiteTextDto findByKey(String key);
    WebsiteTextDto save(String key, String content);
}
