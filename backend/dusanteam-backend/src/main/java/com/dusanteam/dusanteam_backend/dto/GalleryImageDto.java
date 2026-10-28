package com.dusanteam.dusanteam_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryImageDto {
    private Long id;
    private String url;
    private LocalDateTime uploadedAt;
}
