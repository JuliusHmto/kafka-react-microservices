package com.banking.transaction.client;

import com.banking.transaction.dto.AccountDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Client for communicating with the Account Service.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AccountServiceClient {

    private final RestTemplate restTemplate;

    @Value("${account-service.url:http://localhost:8080}")
    private String accountServiceUrl;

    /**
     * Gets all accounts for a user.
     */
    public List<AccountDto> getUserAccounts(UUID userId) {
        try {
            log.info("Getting accounts for user: {}", userId);

            String url = accountServiceUrl + "/api/accounts/user/" + userId;
            
            ResponseEntity<List<AccountDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AccountDto>>() {}
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Found {} accounts for user {}", response.getBody().size(), userId);
                return response.getBody();
            } else {
                log.warn("No accounts found for user: {}", userId);
                return Collections.emptyList();
            }
            
        } catch (Exception e) {
            log.error("Error getting accounts for user {}: {}", userId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }
} 