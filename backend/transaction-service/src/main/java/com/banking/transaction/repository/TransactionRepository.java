package com.banking.transaction.repository;

import com.banking.transaction.domain.entity.Transaction;
import com.banking.transaction.domain.entity.TransactionStatus;
import com.banking.transaction.domain.entity.TransactionType;
import com.banking.transaction.domain.valueobject.TransactionReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Transaction entities.
 * Provides data access methods with domain-focused queries.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    /**
     * Find transaction by reference number.
     */
    Optional<Transaction> findByReference(TransactionReference reference);

    /**
     * Find transactions by source account ID.
     */
    Page<Transaction> findBySourceAccountIdOrderByCreatedAtDesc(UUID sourceAccountId, Pageable pageable);

    /**
     * Find transactions by target account ID.
     */
    Page<Transaction> findByTargetAccountIdOrderByCreatedAtDesc(UUID targetAccountId, Pageable pageable);

    /**
     * Find transactions by either source or target account ID.
     */
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccountId = :accountId OR t.targetAccountId = :accountId ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccountId(@Param("accountId") UUID accountId, Pageable pageable);

    /**
     * Find transactions by status.
     */
    List<Transaction> findByStatusOrderByCreatedAtAsc(TransactionStatus status);

    /**
     * Find transactions by type and status.
     */
    List<Transaction> findByTypeAndStatusOrderByCreatedAtAsc(TransactionType type, TransactionStatus status);

    /**
     * Find pending transactions older than specified time.
     */
    @Query("SELECT t FROM Transaction t WHERE t.status = 'PENDING' AND t.createdAt < :threshold")
    List<Transaction> findPendingTransactionsOlderThan(@Param("threshold") LocalDateTime threshold);

    /**
     * Find transactions by external reference.
     */
    Optional<Transaction> findByExternalReference(String externalReference);

    /**
     * Find transactions between dates for an account.
     */
    @Query("SELECT t FROM Transaction t WHERE (t.sourceAccountId = :accountId OR t.targetAccountId = :accountId) " +
           "AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountIdAndDateRange(@Param("accountId") UUID accountId, 
                                                  @Param("startDate") LocalDateTime startDate, 
                                                  @Param("endDate") LocalDateTime endDate);

    /**
     * Count transactions by status for an account.
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE (t.sourceAccountId = :accountId OR t.targetAccountId = :accountId) AND t.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") UUID accountId, @Param("status") TransactionStatus status);

    /**
     * Find failed transactions with reasons.
     */
    @Query("SELECT t FROM Transaction t WHERE t.status = 'FAILED' AND t.failureReason IS NOT NULL ORDER BY t.updatedAt DESC")
    List<Transaction> findFailedTransactionsWithReasons();

    /**
     * Find transactions by user (through account lookup).
     * Note: This requires joining with account service data or using a different approach.
     * For now, we'll add a method to find by source account IDs.
     */
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccountId IN :accountIds ORDER BY t.createdAt DESC")
    Page<Transaction> findBySourceAccountIdIn(@Param("accountIds") List<UUID> accountIds, Pageable pageable);

    /**
     * Find transactions by user ID.
     */
    Page<Transaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    /**
     * Find transactions by user ID and status.
     */
    Page<Transaction> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, TransactionStatus status, Pageable pageable);

    /**
     * Find transactions by user ID and type.
     */
    Page<Transaction> findByUserIdAndTypeOrderByCreatedAtDesc(UUID userId, TransactionType type, Pageable pageable);

    /**
     * Find transactions by user ID within date range.
     */
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId " +
           "AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") UUID userId, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    /**
     * Count transactions by user ID and status.
     */
    long countByUserIdAndStatus(UUID userId, TransactionStatus status);
} 