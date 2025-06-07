import { AccountService, AccountType, CreateAccountRequest } from '../services/accountService';

// Demo user ID for testing
const DEMO_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

/**
 * Creates sample accounts for testing the integration
 */
export const createSampleAccounts = async () => {
  try {
    console.log('🏦 Creating sample accounts for testing...');

    // Check if backend is healthy first
    const health = await AccountService.healthCheck();
    console.log('✅ Backend health check:', health);

    const accountTypes = [
      AccountType.CHECKING,
      AccountType.SAVINGS,
      AccountType.BUSINESS,
      AccountType.STUDENT
    ];

    const createdAccounts = [];

    for (const accountType of accountTypes) {
      try {
        const request: CreateAccountRequest = {
          userId: DEMO_USER_ID,
          accountType: accountType
        };

        const account = await AccountService.createAccount(request);
        console.log(`✅ Created ${accountType} account:`, account.accountNumber);
        createdAccounts.push(account);

        // Add some initial balance to make it more realistic
        if (account.id) {
          const depositAmount = getRandomDeposit(accountType);
          await AccountService.creditAccount(account.id, {
            amount: depositAmount,
            currency: 'USD',
            description: 'Initial deposit for testing'
          });
          console.log(`💰 Added $${depositAmount} to ${account.accountNumber}`);
        }

        // Small delay to avoid overwhelming the backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`⚠️ Could not create ${accountType} account:`, error);
      }
    }

    console.log(`🎉 Successfully created ${createdAccounts.length} sample accounts!`);
    return createdAccounts;

  } catch (error) {
    console.error('❌ Failed to create sample accounts:', error);
    throw error;
  }
};

/**
 * Get random deposit amount based on account type
 */
const getRandomDeposit = (accountType: AccountType): number => {
  switch (accountType) {
    case AccountType.CHECKING:
      return Math.floor(Math.random() * 5000) + 1000; // $1,000 - $6,000
    case AccountType.SAVINGS:
      return Math.floor(Math.random() * 15000) + 5000; // $5,000 - $20,000
    case AccountType.BUSINESS:
      return Math.floor(Math.random() * 50000) + 10000; // $10,000 - $60,000
    case AccountType.STUDENT:
      return Math.floor(Math.random() * 1000) + 100; // $100 - $1,100
    case AccountType.JOINT:
      return Math.floor(Math.random() * 10000) + 2000; // $2,000 - $12,000
    case AccountType.PREMIUM:
      return Math.floor(Math.random() * 100000) + 25000; // $25,000 - $125,000
    default:
      return 1000;
  }
};

/**
 * Performs sample transactions for testing
 */
export const performSampleTransactions = async () => {
  try {
    console.log('💳 Performing sample transactions...');

    // Get existing accounts
    const accounts = await AccountService.getUserAccounts(DEMO_USER_ID);
    
    if (accounts.length === 0) {
      console.log('No accounts found. Creating sample accounts first...');
      await createSampleAccounts();
      return;
    }

    for (const account of accounts.slice(0, 2)) { // Test on first 2 accounts
      try {
        // Perform a deposit
        await AccountService.creditAccount(account.id, {
          amount: 500,
          currency: 'USD',
          description: 'Test deposit transaction'
        });
        console.log(`✅ Deposited $500 to ${account.accountNumber}`);

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Perform a withdrawal (smaller amount)
        await AccountService.debitAccount(account.id, {
          amount: 100,
          currency: 'USD',
          description: 'Test withdrawal transaction'
        });
        console.log(`✅ Withdrew $100 from ${account.accountNumber}`);

      } catch (error) {
        console.warn(`⚠️ Transaction failed for ${account.accountNumber}:`, error);
      }
    }

    console.log('🎉 Sample transactions completed!');

  } catch (error) {
    console.error('❌ Failed to perform sample transactions:', error);
    throw error;
  }
};

/**
 * Test the complete integration
 */
export const testIntegration = async () => {
  try {
    console.log('🧪 Testing Account Service Integration...');
    
    // 1. Health check
    const health = await AccountService.healthCheck();
    console.log('✅ Health check passed:', health);

    // 2. Get existing accounts
    const existingAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
    console.log(`📊 Found ${existingAccounts.length} existing accounts`);

    // 3. Create sample accounts if none exist
    if (existingAccounts.length === 0) {
      await createSampleAccounts();
    }

    // 4. Perform sample transactions
    await performSampleTransactions();

    // 5. Final account check
    const finalAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
    console.log(`🏁 Final account count: ${finalAccounts.length}`);
    
    finalAccounts.forEach(account => {
      console.log(`📋 ${account.accountNumber} (${account.accountType}): $${account.balance}`);
    });

    console.log('🎉 Integration test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
};

export default {
  createSampleAccounts,
  performSampleTransactions,
  testIntegration,
  DEMO_USER_ID
}; 