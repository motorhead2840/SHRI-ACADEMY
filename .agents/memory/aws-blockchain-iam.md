---
name: AWS Blockchain IAM Permissions
description: The IAM user used for AWS Managed Blockchain requires explicit policy grants; defaults deny everything.
---

## Rule
The IAM user (`SARA_IAM_REPLIT`) must have the `AmazonManagedBlockchainQueryFullAccess` managed policy (or a scoped inline policy) attached before any `managedblockchain-query:*` API calls succeed. Without it, calls fail with authorization errors even though credentials are valid.

**Why:** AWS Managed Blockchain Query is a distinct service with its own IAM namespace (`managedblockchain-query`). New IAM users have no permissions by default.

**How to apply:** In AWS IAM Console → Users → SARA_IAM_REPLIT → Add permissions → Attach policy → `AmazonManagedBlockchainQueryFullAccess`. Or use a minimal inline policy granting `managedblockchain-query:GetTokenBalance`, `managedblockchain-query:ListTokenBalances`, `managedblockchain-query:ListTransactions`.

**Observed error:** `User … is not authorized to perform: managedblockchain-query:GetTokenBalance … because no identity-based policy allows the action`
