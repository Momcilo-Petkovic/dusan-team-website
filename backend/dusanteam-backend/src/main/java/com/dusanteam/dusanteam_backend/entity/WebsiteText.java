package com.dusanteam.dusanteam_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "website_texts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebsiteText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text_key", nullable = false, unique = true)
    private String textKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
}


