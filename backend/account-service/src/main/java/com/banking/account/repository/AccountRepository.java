package com.banking.account.repository;

import com.banking.account.domain.entity.Account;
import com.banking.account.domain.valueobject.AccountNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Account entity operations
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    
    /**
     * Find account by account number
     */
    Optional<Account> findByAccountNumber(AccountNumber accountNumber);
    
    /**
     * Find all accounts for a specific user
     */
    List<Account> findByUserId(UUID userId);
    
    /**
     * Find all active accounts for a user
     */
    @Query("SELECT a FROM Account a WHERE a.userId = :userId AND a.status = 'ACTIVE'")
    List<Account> findActiveAccountsByUserId(@Param("userId") UUID userId);
    
    /**
     * Check if account number already exists
     */
    boolean existsByAccountNumber(AccountNumber accountNumber);
} 