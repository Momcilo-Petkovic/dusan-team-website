package com.dusanteam.dusanteam_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeSlideDto {
    private Long id;
    private String text;
    private String imageUrl;
}
