package com.dusanteam.dusanteam_backend.repository;

import com.dusanteam.dusanteam_backend.entity.WebsiteText;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteTextRepository extends JpaRepository<WebsiteText, Long> {

    Optional<WebsiteText> findByTextKey(String textKey);

    List<WebsiteText> findByTextKeyStartingWith(String prefix);
}
