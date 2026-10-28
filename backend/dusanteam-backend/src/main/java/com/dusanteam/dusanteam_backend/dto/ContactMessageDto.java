package com.dusanteam.dusanteam_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessageDto {
    private String email;
    private String message;
}
