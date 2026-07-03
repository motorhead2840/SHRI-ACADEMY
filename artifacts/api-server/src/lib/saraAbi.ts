/**
 * SARA Token ABI — human-readable format (ethers v6 compatible).
 * Covers: ERC-20, ERC-20 Votes, ERC-20 Permit, ERC-20 Burnable, Ownable2Step, SARA custom.
 */
export const SARA_ABI = [
  // ── ERC-20 standard ──────────────────────────────────────────────────────
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // ── ERC-20 Votes ──────────────────────────────────────────────────────────
  "function getVotes(address account) view returns (uint256)",
  "function delegate(address delegatee)",
  "function delegates(address account) view returns (address)",
  "function getPastVotes(address account, uint256 blockNumber) view returns (uint256)",
  "function getPastTotalSupply(uint256 blockNumber) view returns (uint256)",

  // ── ERC-20 Permit ─────────────────────────────────────────────────────────
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  "function nonces(address owner) view returns (uint256)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",

  // ── ERC-20 Burnable ───────────────────────────────────────────────────────
  "function burn(uint256 amount)",
  "function burnFrom(address account, uint256 amount)",

  // ── Ownable2Step ──────────────────────────────────────────────────────────
  "function owner() view returns (address)",
  "function pendingOwner() view returns (address)",
  "function transferOwnership(address newOwner)",
  "function acceptOwnership()",
  "function renounceOwnership()",

  // ── SARA-specific ─────────────────────────────────────────────────────────
  "function MAX_SUPPLY() view returns (uint256)",
  "function GENESIS_ALLOC() view returns (uint256)",
  "function TREASURY_ALLOC() view returns (uint256)",
  "function ECOSYSTEM_ALLOC() view returns (uint256)",
  "function TEAM_ALLOC() view returns (uint256)",
  "function COMMUNITY_ALLOC() view returns (uint256)",
  "function mint(address to, uint256 amount, string reason)",

  // ── Events ────────────────────────────────────────────────────────────────
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)",
  "event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)",
  "event TokensMinted(address indexed to, uint256 amount, string reason)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner)",
] as const;

export type SaraAbi = typeof SARA_ABI;
