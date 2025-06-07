package com.banking.account.service;

import com.banking.account.domain.entity.Account;
import com.banking.account.domain.entity.AccountType;
import com.banking.account.domain.valueobject.AccountNumber;
import com.banking.account.domain.valueobject.Money;
import com.banking.account.dto.AccountResponse;
import com.banking.account.dto.CreateAccountRequest;
import com.banking.account.dto.MoneyTransactionRequest;
import com.banking.account.repository.AccountRepository;
import com.banking.account.event.AccountCreatedEvent;
import com.banking.account.event.MoneyTransactionEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service layer for account business operations
 */
@Service
@Transactional
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final EventPublisherService eventPublisher;
    
    @Autowired
    public AccountService(AccountRepository accountRepository, EventPublisherService eventPublisher) {
        this.accountRepository = accountRepository;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Create a new bank account
     */
    public AccountResponse createAccount(CreateAccountRequest request) {
        // Generate unique account number
        AccountNumber accountNumber;
        do {
            accountNumber = AccountNumber.generate();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        
        // Create new account
        Account account = new Account(accountNumber, request.getUserId(), request.getAccountType());
        account.activate(); // Auto-activate for demo purposes
        
        // Save and return
        Account savedAccount = accountRepository.save(account);
        
        // Publish account created event
        AccountCreatedEvent event = new AccountCreatedEvent(
                savedAccount.getId(),
                savedAccount.getUserId(),
                savedAccount.getAccountNumber().getValue(),
                savedAccount.getAccountType(),
                savedAccount.getBalance().getAmount(),
                savedAccount.getBalance().getCurrency()
        );
        eventPublisher.publishAccountEvent(event);
        
        return mapToResponse(savedAccount);
    }
    
    /**
     * Get account by ID
     */
    @Transactional(readOnly = true)
    public AccountResponse getAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId));
        return mapToResponse(account);
    }
    
    /**
     * Get account by account number
     */
    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        AccountNumber accNum = new AccountNumber(accountNumber);
        Account account = accountRepository.findByAccountNumber(accNum)
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountNumber));
        return mapToResponse(account);
    }
    
    /**
     * Get all accounts for a user
     */
    @Transactional(readOnly = true)
    public List<AccountResponse> getUserAccounts(UUID userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Credit money to account
     */
    public AccountResponse creditAccount(UUID accountId, MoneyTransactionRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId));
        
        Money amount = new Money(request.getAmount(), request.getCurrency());
        account.credit(amount);
        
        Account savedAccount = accountRepository.save(account);
        
        // Publish money deposited event
        MoneyTransactionEvent event = new MoneyTransactionEvent(
                savedAccount.getId(),
                savedAccount.getUserId(),
                MoneyTransactionEvent.TransactionType.DEPOSIT,
                request.getAmount(),
                request.getCurrency(),
                savedAccount.getBalance().getAmount(),
                request.getDescription()
        );
        eventPublisher.publishTransactionEvent(event);
        eventPublisher.publishTransactionForFraudDetection(event);
        
        return mapToResponse(savedAccount);
    }
    
    /**
     * Debit money from account
     */
    public AccountResponse debitAccount(UUID accountId, MoneyTransactionRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId));
        
        Money amount = new Money(request.getAmount(), request.getCurrency());
        account.debit(amount);
        
        Account savedAccount = accountRepository.save(account);
        
        // Publish money withdrawn event
        MoneyTransactionEvent event = new MoneyTransactionEvent(
                savedAccount.getId(),
                savedAccount.getUserId(),
                MoneyTransactionEvent.TransactionType.WITHDRAWAL,
                request.getAmount(),
                request.getCurrency(),
                savedAccount.getBalance().getAmount(),
                request.getDescription()
        );
        eventPublisher.publishTransactionEvent(event);
        eventPublisher.publishTransactionForFraudDetection(event);
        
        return mapToResponse(savedAccount);
    }
    
    /**
     * Get account balance
     */
    @Transactional(readOnly = true)
    public Money getAccountBalance(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId));
        return account.getBalance();
    }
    
    /**
     * Map Account entity to AccountResponse DTO
     */
    private AccountResponse mapToResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setAccountNumber(account.getAccountNumber().getValue());
        response.setUserId(account.getUserId());
        response.setAccountType(account.getAccountType());
        response.setStatus(account.getStatus());
        response.setBalance(account.getBalance().getAmount());
        response.setCurrency(account.getBalance().getCurrency());
        response.setAvailableBalance(account.getAvailableBalance().getAmount());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }
} 