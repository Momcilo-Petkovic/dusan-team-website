package com.dusanteam.dusanteam_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebsiteTextDto {
    private Long id;
    private String key;
    private String content;
}
