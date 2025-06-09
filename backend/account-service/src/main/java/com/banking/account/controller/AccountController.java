package com.banking.account.controller;

import com.banking.account.domain.valueobject.Money;
import com.banking.account.dto.AccountResponse;
import com.banking.account.dto.CreateAccountRequest;
import com.banking.account.dto.MoneyTransactionRequest;
import com.banking.account.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Account Management
 * 
 * Provides banking API endpoints for:
 * - Account creation
 * - Account inquiry  
 * - Money transactions (credit/debit)
 * - Balance checking
 */
@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*") // For React frontend
public class AccountController {
    
    private final AccountService accountService;
    
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    /**
     * Create a new bank account
     * POST /api/accounts
     */
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        try {
            AccountResponse response = accountService.createAccount(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            // Check if it's a foreign key constraint error for user_id
            if (e.getMessage() != null && e.getMessage().contains("accounts_user_id_fkey")) {
                throw new RuntimeException("User with ID " + request.getUserId() + " does not exist. " +
                    "Please ensure the user exists before creating an account. " +
                    "For development, you can run: scripts/fix-demo-user.ps1");
            }
            throw new RuntimeException("Failed to create account: " + e.getMessage());
        }
    }
    
    /**
     * Get account by ID
     * GET /api/accounts/{accountId}
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable UUID accountId) {
        try {
            AccountResponse response = accountService.getAccount(accountId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get account by account number
     * GET /api/accounts/number/{accountNumber}
     */
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccountByNumber(@PathVariable String accountNumber) {
        try {
            AccountResponse response = accountService.getAccountByNumber(accountNumber);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all accounts for a user
     * GET /api/accounts/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getUserAccounts(@PathVariable UUID userId) {
        List<AccountResponse> accounts = accountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }
    
    /**
     * Credit money to account (Deposit)
     * POST /api/accounts/{accountId}/credit
     */
    @PostMapping("/{accountId}/credit")
    public ResponseEntity<AccountResponse> creditAccount(
            @PathVariable UUID accountId,
            @Valid @RequestBody MoneyTransactionRequest request) {
        try {
            AccountResponse response = accountService.creditAccount(accountId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException | IllegalArgumentException e) {
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
    }
    
    /**
     * Debit money from account (Withdrawal)
     * POST /api/accounts/{accountId}/debit
     */
    @PostMapping("/{accountId}/debit")
    public ResponseEntity<AccountResponse> debitAccount(
            @PathVariable UUID accountId,
            @Valid @RequestBody MoneyTransactionRequest request) {
        try {
            AccountResponse response = accountService.debitAccount(accountId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException | IllegalArgumentException e) {
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
    }
    
    /**
     * Get account balance
     * GET /api/accounts/{accountId}/balance
     */
    @GetMapping("/{accountId}/balance")
    public ResponseEntity<Map<String, Object>> getAccountBalance(@PathVariable UUID accountId) {
        try {
            Money balance = accountService.getAccountBalance(accountId);
            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("balance", balance.getAmount());
            response.put("currency", balance.getCurrency());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/accounts/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "account-service");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Global exception handler for this controller
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
} 