package com.euchelu.bank;

/**
 * Represents a bank account with basic operations.
 * Designed to demonstrate JUnit 5 testing patterns.
 */
public class BankAccount {

    private final String owner;
    private double balance;
    private boolean frozen;

    public BankAccount(String owner, double initialBalance) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("Owner name cannot be empty");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        this.owner = owner;
        this.balance = initialBalance;
        this.frozen = false;
    }

    public void deposit(double amount) {
        validateNotFrozen();
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        this.balance += amount;
    }

    public void withdraw(double amount) {
        validateNotFrozen();
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        if (amount > this.balance) {
            throw new IllegalStateException("Insufficient funds");
        }
        this.balance -= amount;
    }

    public void transfer(BankAccount target, double amount) {
        validateNotFrozen();
        if (target == null) {
            throw new IllegalArgumentException("Target account cannot be null");
        }
        if (target == this) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        this.withdraw(amount);
        target.deposit(amount);
    }

    public void freeze() {
        this.frozen = true;
    }

    public void unfreeze() {
        this.frozen = false;
    }

    private void validateNotFrozen() {
        if (this.frozen) {
            throw new IllegalStateException("Account is frozen");
        }
    }

    public double getBalance() { return balance; }
    public String getOwner()   { return owner; }
    public boolean isFrozen()  { return frozen; }
}
