package com.banking.transaction.domain.entity;

import com.banking.transaction.domain.valueobject.Money;
import com.banking.transaction.domain.valueobject.TransactionReference;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Transaction Entity representing a financial transaction in the system.
 * 
 * Demonstrates:
 * - Domain-Driven Design (DDD) entity patterns
 * - Value objects (TransactionReference, Money)
 * - JPA entity mapping
 * - Business rules implementation
 */
@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_reference", columnList = "reference_value"),
    @Index(name = "idx_source_account", columnList = "source_account_id"),
    @Index(name = "idx_target_account", columnList = "target_account_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class Transaction {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "reference_value", unique = true, nullable = false))
    private TransactionReference reference;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "amount", column = @Column(name = "amount", nullable = false)),
        @AttributeOverride(name = "currency", column = @Column(name = "currency", nullable = false))
    })
    private Money amount;

    @Column(name = "source_account_id")
    private UUID sourceAccountId;

    @Column(name = "target_account_id")
    private UUID targetAccountId;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "external_reference", length = 100)
    private String externalReference;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    // Constructors
    protected Transaction() {
        // JPA requires default constructor
    }

    public Transaction(TransactionType type, Money amount, UUID sourceAccountId, UUID targetAccountId, String description) {
        this.reference = TransactionReference.generate();
        this.type = type;
        this.amount = amount;
        this.sourceAccountId = sourceAccountId;
        this.targetAccountId = targetAccountId;
        this.description = description;
        this.status = TransactionStatus.PENDING;
    }

    public Transaction(TransactionType type, Money amount, UUID sourceAccountId, String description) {
        this(type, amount, sourceAccountId, null, description);
    }

    // Business methods

    /**
     * Processes the transaction, changing status to PROCESSING.
     */
    public void process() {
        validateCanBeProcessed();
        this.status = TransactionStatus.PROCESSING;
    }

    /**
     * Completes the transaction successfully.
     */
    public void complete() {
        validateProcessingStatus();
        this.status = TransactionStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Fails the transaction with a reason.
     */
    public void fail(String reason) {
        validateCanBeFailed();
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Cancels the transaction.
     */
    public void cancel() {
        validateCanBeCancelled();
        this.status = TransactionStatus.CANCELLED;
        this.processedAt = LocalDateTime.now();
    }

    /**
     * Reverses a completed transaction.
     */
    public void reverse() {
        validateCanBeReversed();
        this.status = TransactionStatus.REVERSED;
    }

    /**
     * Sets an external reference for the transaction.
     */
    public void setExternalReference(String externalReference) {
        if (externalReference != null && externalReference.length() > 100) {
            throw new IllegalArgumentException("External reference cannot exceed 100 characters");
        }
        this.externalReference = externalReference;
    }

    // Validation methods
    private void validateCanBeProcessed() {
        if (!this.status.canBeProcessed()) {
            throw new IllegalStateException("Transaction cannot be processed in current status: " + this.status);
        }
    }

    private void validateProcessingStatus() {
        if (this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("Transaction must be in PROCESSING status to complete");
        }
    }

    private void validateCanBeFailed() {
        if (this.status != TransactionStatus.PENDING && this.status != TransactionStatus.PROCESSING) {
            throw new IllegalStateException("Transaction cannot be failed in current status: " + this.status);
        }
    }

    private void validateCanBeCancelled() {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException("Only PENDING transactions can be cancelled");
        }
    }

    private void validateCanBeReversed() {
        if (this.status != TransactionStatus.COMPLETED) {
            throw new IllegalStateException("Only COMPLETED transactions can be reversed");
        }
    }

    // Query methods
    public boolean isTransfer() {
        return this.type == TransactionType.TRANSFER && this.targetAccountId != null;
    }

    public boolean isDebitTransaction() {
        return this.type.isDebit();
    }

    public boolean isCreditTransaction() {
        return this.type.isCredit();
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }

    public boolean isCompleted() {
        return this.status == TransactionStatus.COMPLETED;
    }

    public boolean isFailed() {
        return this.status == TransactionStatus.FAILED;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public TransactionReference getReference() {
        return reference;
    }

    public TransactionType getType() {
        return type;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public Money getAmount() {
        return amount;
    }

    public UUID getSourceAccountId() {
        return sourceAccountId;
    }

    public UUID getTargetAccountId() {
        return targetAccountId;
    }

    public String getDescription() {
        return description;
    }

    public String getExternalReference() {
        return externalReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public String getFailureReason() {
        return failureReason;
    }

    @Override
    public String toString() {
        return String.format("Transaction{id=%s, reference=%s, type=%s, status=%s, amount=%s}", 
            id, reference, type, status, amount);
    }
} 