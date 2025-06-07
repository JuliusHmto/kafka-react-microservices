package com.banking.account.domain.valueobject;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import java.util.Objects;
import java.util.Random;

/**
 * Value object representing an account number.
 * Demonstrates immutability and validation patterns.
 */
@Embeddable
public class AccountNumber {
    
    @NotBlank(message = "Account number cannot be blank")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Account number must be 10-12 digits")
    private String value;
    
    protected AccountNumber() {
        // JPA requires default constructor
    }
    
    public AccountNumber(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }
        if (!value.matches("^[0-9]{10,12}$")) {
            throw new IllegalArgumentException("Account number must be 10-12 digits");
        }
        this.value = value;
    }
    
    /**
     * Generates a new random account number.
     */
    public static AccountNumber generate() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return new AccountNumber(sb.toString());
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AccountNumber that = (AccountNumber) o;
        return Objects.equals(value, that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return value;
    }
} 