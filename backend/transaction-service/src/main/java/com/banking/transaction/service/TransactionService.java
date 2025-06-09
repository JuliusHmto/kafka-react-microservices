package com.banking.transaction.service;

import com.banking.transaction.client.AccountServiceClient;
import com.banking.transaction.domain.entity.Transaction;
import com.banking.transaction.domain.entity.TransactionStatus;
import com.banking.transaction.domain.entity.TransactionType;
import com.banking.transaction.domain.valueobject.Money;
import com.banking.transaction.domain.valueobject.TransactionReference;
import com.banking.transaction.dto.AccountDto;
import com.banking.transaction.dto.CreateTransactionRequest;
import com.banking.transaction.dto.TransactionDto;
import com.banking.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Main service class for transaction operations.
 * Implements business logic and coordinates with other services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final EventPublisherService eventPublisherService;
    private final AccountServiceClient accountServiceClient;

    /**
     * Creates a new transaction.
     */
    public TransactionDto createTransaction(CreateTransactionRequest request) {
        log.info("Creating transaction: type={}, amount={}, sourceAccount={}", 
                request.getType(), request.getAmount(), request.getSourceAccountId());

        try {
            TransactionType type = TransactionType.valueOf(request.getType().toUpperCase());
            Money amount = Money.of(request.getAmount(), request.getCurrency());

            Transaction transaction = new Transaction(
                type, 
                amount, 
                request.getSourceAccountId(),
                request.getTargetAccountId(),
                request.getDescription()
            );

            if (request.getExternalReference() != null) {
                transaction.setExternalReference(request.getExternalReference());
            }

            Transaction savedTransaction = transactionRepository.save(transaction);
            
            // Publish transaction created event
            eventPublisherService.publishTransactionCreated(savedTransaction);
            
            log.info("Transaction created successfully: {}", savedTransaction.getReference());
            return mapToDto(savedTransaction);

        } catch (IllegalArgumentException e) {
            log.error("Invalid transaction type: {}", request.getType());
            throw new IllegalArgumentException("Invalid transaction type: " + request.getType());
        }
    }

    /**
     * Processes a pending transaction.
     */
    public TransactionDto processTransaction(UUID transactionId) {
        log.info("Processing transaction: {}", transactionId);

        Transaction transaction = findTransactionById(transactionId);
        transaction.process();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Publish transaction processing event
        eventPublisherService.publishTransactionProcessing(savedTransaction);
        
        log.info("Transaction processing started: {}", transaction.getReference());
        return mapToDto(savedTransaction);
    }

    /**
     * Completes a processing transaction.
     */
    public TransactionDto completeTransaction(UUID transactionId) {
        log.info("Completing transaction: {}", transactionId);

        Transaction transaction = findTransactionById(transactionId);
        transaction.complete();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Publish transaction completed event
        eventPublisherService.publishTransactionCompleted(savedTransaction);
        
        log.info("Transaction completed successfully: {}", transaction.getReference());
        return mapToDto(savedTransaction);
    }

    /**
     * Fails a transaction with a reason.
     */
    public TransactionDto failTransaction(UUID transactionId, String reason) {
        log.info("Failing transaction: {} with reason: {}", transactionId, reason);

        Transaction transaction = findTransactionById(transactionId);
        transaction.fail(reason);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Publish transaction failed event
        eventPublisherService.publishTransactionFailed(savedTransaction);
        
        log.info("Transaction failed: {}", transaction.getReference());
        return mapToDto(savedTransaction);
    }

    /**
     * Cancels a pending transaction.
     */
    public TransactionDto cancelTransaction(UUID transactionId) {
        log.info("Cancelling transaction: {}", transactionId);

        Transaction transaction = findTransactionById(transactionId);
        transaction.cancel();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Publish transaction cancelled event
        eventPublisherService.publishTransactionCancelled(savedTransaction);
        
        log.info("Transaction cancelled: {}", transaction.getReference());
        return mapToDto(savedTransaction);
    }

    /**
     * Reverses a completed transaction.
     */
    public TransactionDto reverseTransaction(UUID transactionId) {
        log.info("Reversing transaction: {}", transactionId);

        Transaction transaction = findTransactionById(transactionId);
        transaction.reverse();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Publish transaction reversed event
        eventPublisherService.publishTransactionReversed(savedTransaction);
        
        log.info("Transaction reversed: {}", transaction.getReference());
        return mapToDto(savedTransaction);
    }

    /**
     * Retrieves transaction by ID.
     */
    @Transactional(readOnly = true)
    public TransactionDto getTransaction(UUID transactionId) {
        Transaction transaction = findTransactionById(transactionId);
        return mapToDto(transaction);
    }

    /**
     * Retrieves transaction by reference.
     */
    @Transactional(readOnly = true)
    public TransactionDto getTransactionByReference(String reference) {
        TransactionReference transactionRef = TransactionReference.of(reference);
        Transaction transaction = transactionRepository.findByReference(transactionRef)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + reference));
        return mapToDto(transaction);
    }

    /**
     * Retrieves transactions for an account.
     */
    @Transactional(readOnly = true)
    public Page<TransactionDto> getAccountTransactions(UUID accountId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByAccountId(accountId, pageable);
        return transactions.map(this::mapToDto);
    }

    /**
     * Retrieves transactions by status.
     */
    @Transactional(readOnly = true)
    public List<TransactionDto> getTransactionsByStatus(TransactionStatus status) {
        List<Transaction> transactions = transactionRepository.findByStatusOrderByCreatedAtAsc(status);
        return transactions.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves pending transactions older than specified hours.
     */
    @Transactional(readOnly = true)
    public List<TransactionDto> getPendingTransactionsOlderThan(int hours) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
        List<Transaction> transactions = transactionRepository.findPendingTransactionsOlderThan(threshold);
        return transactions.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves transactions for a user across all their accounts.
     */
    @Transactional(readOnly = true)
    public Page<TransactionDto> getUserTransactions(UUID userId, Pageable pageable) {
        log.info("Getting transactions for user: {}", userId);
        
        // Get all accounts for the user
        List<AccountDto> userAccounts = accountServiceClient.getUserAccounts(userId);
        
        if (userAccounts.isEmpty()) {
            log.info("No accounts found for user: {}", userId);
            return Page.empty(pageable);
        }
        
        // Extract account IDs
        List<UUID> accountIds = userAccounts.stream()
                .map(AccountDto::getId)
                .collect(Collectors.toList());
        
        log.info("Found {} accounts for user {}, getting transactions", accountIds.size(), userId);
        
        // Get transactions for all user accounts
        Page<Transaction> transactions = transactionRepository.findBySourceAccountIdIn(accountIds, pageable);
        
        return transactions.map(this::mapToDto);
    }

    private Transaction findTransactionById(UUID transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
    }

    private TransactionDto mapToDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .reference(transaction.getReference().getValue())
                .type(transaction.getType().name())
                .status(transaction.getStatus().name())
                .amount(transaction.getAmount().getAmount())
                .currency(transaction.getAmount().getCurrency())
                .sourceAccountId(transaction.getSourceAccountId())
                .targetAccountId(transaction.getTargetAccountId())
                .description(transaction.getDescription())
                .externalReference(transaction.getExternalReference())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .processedAt(transaction.getProcessedAt())
                .failureReason(transaction.getFailureReason())
                .build();
    }
} 