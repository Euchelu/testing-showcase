package com.euchelu.bank;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("BankAccount Tests")
class BankAccountTest {

    private BankAccount account;
    private BankAccount target;

    @BeforeEach
    void setUp() {
        account = new BankAccount("José Ángel", 1000.0);
        target  = new BankAccount("Target User", 500.0);
    }

    // ── Constructor ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("Creates account with correct owner and balance")
    void testConstructor() {
        assertEquals("José Ángel", account.getOwner());
        assertEquals(1000.0, account.getBalance());
        assertFalse(account.isFrozen());
    }

    @Test
    @DisplayName("Throws on empty owner name")
    void testConstructorEmptyOwner() {
        assertThrows(IllegalArgumentException.class,
            () -> new BankAccount("", 100.0));
    }

    @Test
    @DisplayName("Throws on negative initial balance")
    void testConstructorNegativeBalance() {
        assertThrows(IllegalArgumentException.class,
            () -> new BankAccount("User", -1.0));
    }

    // ── Deposit ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Deposit increases balance correctly")
    void testDeposit() {
        account.deposit(500.0);
        assertEquals(1500.0, account.getBalance());
    }

    @ParameterizedTest(name = "Deposit of {0} is invalid")
    @ValueSource(doubles = {0, -1, -100})
    @DisplayName("Throws on non-positive deposit amount")
    void testDepositInvalidAmount(double amount) {
        assertThrows(IllegalArgumentException.class,
            () -> account.deposit(amount));
    }

    @Test
    @DisplayName("Cannot deposit into frozen account")
    void testDepositFrozen() {
        account.freeze();
        assertThrows(IllegalStateException.class,
            () -> account.deposit(100.0));
    }

    // ── Withdraw ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Withdraw decreases balance correctly")
    void testWithdraw() {
        account.withdraw(300.0);
        assertEquals(700.0, account.getBalance());
    }

    @Test
    @DisplayName("Throws on insufficient funds")
    void testWithdrawInsufficientFunds() {
        assertThrows(IllegalStateException.class,
            () -> account.withdraw(1500.0));
    }

    @Test
    @DisplayName("Balance unchanged after failed withdrawal")
    void testWithdrawBalanceUnchangedOnFailure() {
        try { account.withdraw(9999.0); } catch (IllegalStateException ignored) {}
        assertEquals(1000.0, account.getBalance());
    }

    @Test
    @DisplayName("Cannot withdraw from frozen account")
    void testWithdrawFrozen() {
        account.freeze();
        assertThrows(IllegalStateException.class,
            () -> account.withdraw(100.0));
    }

    // ── Transfer ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Transfer moves funds between accounts")
    void testTransfer() {
        account.transfer(target, 200.0);
        assertEquals(800.0, account.getBalance());
        assertEquals(700.0, target.getBalance());
    }

    @Test
    @DisplayName("Throws when transferring to null account")
    void testTransferNullTarget() {
        assertThrows(IllegalArgumentException.class,
            () -> account.transfer(null, 100.0));
    }

    @Test
    @DisplayName("Throws when transferring to same account")
    void testTransferSameAccount() {
        assertThrows(IllegalArgumentException.class,
            () -> account.transfer(account, 100.0));
    }

    @Test
    @DisplayName("Transfer fails atomically — no partial state")
    void testTransferAtomicity() {
        assertThrows(IllegalStateException.class,
            () -> account.transfer(target, 9999.0));
        assertEquals(1000.0, account.getBalance());
        assertEquals(500.0,  target.getBalance());
    }

    // ── Freeze / Unfreeze ─────────────────────────────────────────────────────

    @Test
    @DisplayName("Freeze and unfreeze work correctly")
    void testFreezeUnfreeze() {
        account.freeze();
        assertTrue(account.isFrozen());

        account.unfreeze();
        assertFalse(account.isFrozen());

        assertDoesNotThrow(() -> account.deposit(100.0));
    }
}
