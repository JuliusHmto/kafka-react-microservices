package com.banking.account.domain.entity;

import com.banking.account.domain.valueobject.AccountNumber;
import com.banking.account.domain.valueobject.Money;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Account Entity representing a bank account in the system.
 * 
 * Demonstrates:
 * - Domain-Driven Design (DDD) entity patterns
 * - Value objects (AccountNumber, Money)
 * - JPA entity mapping
 * - Validation constraints
 */
@Entity
@Table(name = "accounts", indexes = {
    @Index(name = "idx_account_number", columnList = "account_number"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
public class Account {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "account_number", unique = true, nullable = false))
    private AccountNumber accountNumber;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccountStatus status = AccountStatus.PENDING;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "balance")),
        @AttributeOverride(name = "currency", column = @Column(name = "currency"))
    })
    private Money balance;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "available_balance")),
        @AttributeOverride(name = "currency", column = @Column(name = "available_currency"))
    })
    private Money availableBalance;

    @Column(name = "daily_limit")
    private BigDecimal dailyLimit = new BigDecimal("5000.00");

    @Column(name = "monthly_limit")
    private BigDecimal monthlyLimit = new BigDecimal("50000.00");

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // Constructors
    protected Account() {
        // JPA requires default constructor
    }

    public Account(AccountNumber accountNumber, UUID userId, AccountType accountType) {
        this.accountNumber = accountNumber;
        this.userId = userId;
        this.accountType = accountType;
        this.balance = Money.zero("USD");
        this.availableBalance = Money.zero("USD");
        this.status = AccountStatus.PENDING;
    }

    // Business methods
    
    /**
     * Credits the account with the specified amount.
     * Implements business rules for deposit operations.
     */
    public void credit(Money amount) {
        validateActiveStatus();
        validateCurrency(amount);
        
        this.balance = this.balance.add(amount);
        this.availableBalance = this.availableBalance.add(amount);
    }

    /**
     * Debits the account with the specified amount.
     * Implements business rules for withdrawal operations.
     */
    public void debit(Money amount) {
        validateActiveStatus();
        validateCurrency(amount);
        validateSufficientFunds(amount);
        
        this.balance = this.balance.subtract(amount);
        this.availableBalance = this.availableBalance.subtract(amount);
    }

    /**
     * Blocks the specified amount from available balance.
     * Used for pending transactions.
     */
    public void blockFunds(Money amount) {
        validateActiveStatus();
        validateCurrency(amount);
        validateSufficientAvailableFunds(amount);
        
        this.availableBalance = this.availableBalance.subtract(amount);
    }

    /**
     * Releases blocked funds back to available balance.
     */
    public void releaseFunds(Money amount) {
        validateActiveStatus();
        validateCurrency(amount);
        
        // Ensure we don't release more than what's blocked
        Money maxRelease = this.balance.subtract(this.availableBalance);
        if (amount.isGreaterThan(maxRelease)) {
            throw new IllegalArgumentException("Cannot release more funds than blocked");
        }
        
        this.availableBalance = this.availableBalance.add(amount);
    }

    /**
     * Activates the account if it's pending.
     */
    public void activate() {
        if (this.status != AccountStatus.PENDING) {
            throw new IllegalStateException("Only PENDING accounts can be activated");
        }
        this.status = AccountStatus.ACTIVE;
    }

    /**
     * Suspends the account.
     */
    public void suspend() {
        if (this.status == AccountStatus.CLOSED) {
            throw new IllegalStateException("Cannot suspend a CLOSED account");
        }
        this.status = AccountStatus.SUSPENDED;
    }

    /**
     * Closes the account.
     */
    public void close() {
        if (!this.balance.isZero()) {
            throw new IllegalStateException("Cannot close account with non-zero balance");
        }
        this.status = AccountStatus.CLOSED;
        this.closedAt = LocalDateTime.now();
    }

    // Validation methods
    private void validateActiveStatus() {
        if (this.status != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Account is not active");
        }
    }

    private void validateCurrency(Money amount) {
        if (!this.balance.hasSameCurrency(amount)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
    }

    private void validateSufficientFunds(Money amount) {
        if (this.balance.isLessThan(amount)) {
            throw new IllegalArgumentException("Insufficient funds");
        }
    }

    private void validateSufficientAvailableFunds(Money amount) {
        if (this.availableBalance.isLessThan(amount)) {
            throw new IllegalArgumentException("Insufficient available funds");
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public AccountNumber getAccountNumber() {
        return accountNumber;
    }

    public UUID getUserId() {
        return userId;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public Money getBalance() {
        return balance;
    }

    public Money getAvailableBalance() {
        return availableBalance;
    }

    public BigDecimal getDailyLimit() {
        return dailyLimit;
    }

    public void setDailyLimit(BigDecimal dailyLimit) {
        this.dailyLimit = dailyLimit;
    }

    public BigDecimal getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(BigDecimal monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", accountNumber=" + accountNumber +
                ", userId=" + userId +
                ", accountType=" + accountType +
                ", status=" + status +
                ", balance=" + balance +
                ", availableBalance=" + availableBalance +
                '}';
    }
} 