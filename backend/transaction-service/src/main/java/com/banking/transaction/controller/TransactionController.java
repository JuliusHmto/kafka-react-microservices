package com.banking.transaction.controller;

import com.banking.transaction.domain.entity.TransactionStatus;
import com.banking.transaction.dto.CreateTransactionRequest;
import com.banking.transaction.dto.TransactionDto;
import com.banking.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for transaction operations.
 * Provides HTTP endpoints for transaction management.
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Creates a new transaction.
     */
    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        log.info("Creating transaction request: {}", request);
        TransactionDto transaction = transactionService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    /**
     * Retrieves a transaction by ID.
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDto> getTransaction(@PathVariable UUID transactionId) {
        log.info("Getting transaction: {}", transactionId);
        TransactionDto transaction = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(transaction);
    }

    /**
     * Retrieves a transaction by reference.
     */
    @GetMapping("/reference/{reference}")
    public ResponseEntity<TransactionDto> getTransactionByReference(@PathVariable String reference) {
        log.info("Getting transaction by reference: {}", reference);
        TransactionDto transaction = transactionService.getTransactionByReference(reference);
        return ResponseEntity.ok(transaction);
    }

    /**
     * Retrieves transactions for an account.
     */
    @GetMapping("/account/{accountId}")
    public ResponseEntity<Page<TransactionDto>> getAccountTransactions(
            @PathVariable UUID accountId,
            Pageable pageable) {
        log.info("Getting transactions for account: {}", accountId);
        Page<TransactionDto> transactions = transactionService.getAccountTransactions(accountId, pageable);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Retrieves transactions by status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TransactionDto>> getTransactionsByStatus(@PathVariable String status) {
        log.info("Getting transactions by status: {}", status);
        try {
            TransactionStatus transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
            List<TransactionDto> transactions = transactionService.getTransactionsByStatus(transactionStatus);
            return ResponseEntity.ok(transactions);
        } catch (IllegalArgumentException e) {
            log.error("Invalid transaction status: {}", status);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Processes a pending transaction.
     */
    @PostMapping("/{transactionId}/process")
    public ResponseEntity<TransactionDto> processTransaction(@PathVariable UUID transactionId) {
        log.info("Processing transaction: {}", transactionId);
        try {
            TransactionDto transaction = transactionService.processTransaction(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Failed to process transaction: {}", transactionId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Completes a processing transaction.
     */
    @PostMapping("/{transactionId}/complete")
    public ResponseEntity<TransactionDto> completeTransaction(@PathVariable UUID transactionId) {
        log.info("Completing transaction: {}", transactionId);
        try {
            TransactionDto transaction = transactionService.completeTransaction(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Failed to complete transaction: {}", transactionId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Fails a transaction with a reason.
     */
    @PostMapping("/{transactionId}/fail")
    public ResponseEntity<TransactionDto> failTransaction(
            @PathVariable UUID transactionId,
            @RequestParam String reason) {
        log.info("Failing transaction: {} with reason: {}", transactionId, reason);
        try {
            TransactionDto transaction = transactionService.failTransaction(transactionId, reason);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Failed to fail transaction: {}", transactionId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cancels a pending transaction.
     */
    @PostMapping("/{transactionId}/cancel")
    public ResponseEntity<TransactionDto> cancelTransaction(@PathVariable UUID transactionId) {
        log.info("Cancelling transaction: {}", transactionId);
        try {
            TransactionDto transaction = transactionService.cancelTransaction(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Failed to cancel transaction: {}", transactionId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Reverses a completed transaction.
     */
    @PostMapping("/{transactionId}/reverse")
    public ResponseEntity<TransactionDto> reverseTransaction(@PathVariable UUID transactionId) {
        log.info("Reversing transaction: {}", transactionId);
        try {
            TransactionDto transaction = transactionService.reverseTransaction(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            log.error("Failed to reverse transaction: {}", transactionId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Retrieves pending transactions older than specified hours.
     */
    @GetMapping("/pending/older-than/{hours}")
    public ResponseEntity<List<TransactionDto>> getPendingTransactionsOlderThan(@PathVariable int hours) {
        log.info("Getting pending transactions older than {} hours", hours);
        List<TransactionDto> transactions = transactionService.getPendingTransactionsOlderThan(hours);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Retrieves transaction history for a user across all their accounts.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<TransactionDto>> getUserTransactions(
            @PathVariable UUID userId,
            Pageable pageable) {
        log.info("Getting transaction history for user: {}", userId);
        Page<TransactionDto> transactions = transactionService.getUserTransactions(userId, pageable);
        return ResponseEntity.ok(transactions);
    }
} 