package com.dusanteam.dusanteam_backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.UUID;

import static org.springframework.security.config.Customizer.withDefaults;

@Slf4j
@Configuration
public class SecurityConfig {

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // uses the CorsConfigurationSource bean from WebConfig
                .cors(withDefaults())
                // stateless REST API with Basic Auth, no session cookies, so CSRF doesn't apply
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // public website
                        .requestMatchers(HttpMethod.GET, "/api/slides", "/api/gallery/**", "/api/texts/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // everything else (uploads, edits, deletes, /api/admin/check) is admin only
                        .anyRequest().hasRole("ADMIN")
                )
                .httpBasic(withDefaults());

        return http.build();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder passwordEncoder) {
        String password = adminPassword;
        if (password == null || password.isBlank()) {
            // Never ship a default password: generate one for this run instead
            password = UUID.randomUUID().toString().substring(0, 12);
            log.warn("ADMIN_PASSWORD is not set. Admin login for this run: {} / {}", adminUsername, password);
        }
        UserDetails admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(password))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
