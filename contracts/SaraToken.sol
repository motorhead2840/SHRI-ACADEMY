// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title  SaraToken
 * @notice SRI Adaptive Response Asset (SARA) — governance + utility token
 *         for the SRI Learn global homeschooling platform.
 *
 * Token economics (100 M max supply):
 *  ┌──────────────────────────────────────────┐
 *  │ Tranche          │  Tokens    │  Share   │
 *  ├──────────────────┼────────────┼──────────┤
 *  │ Treasury (DAO)   │  40 000 000│  40 %    │
 *  │ Ecosystem grants │  25 000 000│  25 %    │
 *  │ Team & advisors  │  15 000 000│  15 %    │
 *  │ Community rewards│  10 000 000│  10 %    │
 *  │ Genesis (deploy) │  10 000 000│  10 %    │
 *  └──────────────────┴────────────┴──────────┘
 *
 * Features:
 *  • ERC-20 standard transfers & approvals
 *  • ERC-20 Permit  — gasless approvals (EIP-2612)
 *  • ERC-20 Votes   — snapshot-based DAO voting power
 *  • ERC-20 Burnable — token holders can burn their own tokens
 *  • Ownable2Step   — two-step ownership transfer (safe for DAO multisig handover)
 *
 * Deployed on:  Ethereum Sepolia testnet
 * Node backend: AWS Managed Blockchain (Ethereum)
 */
contract SaraToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Ownable2Step {

    // ─── Supply constants ────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY      = 100_000_000 * 10 ** 18;
    uint256 public constant GENESIS_ALLOC   =  10_000_000 * 10 ** 18; // minted at deploy
    uint256 public constant TREASURY_ALLOC  =  40_000_000 * 10 ** 18; // DAO-controlled
    uint256 public constant ECOSYSTEM_ALLOC =  25_000_000 * 10 ** 18; // grants
    uint256 public constant TEAM_ALLOC      =  15_000_000 * 10 ** 18; // vesting
    uint256 public constant COMMUNITY_ALLOC =  10_000_000 * 10 ** 18; // rewards

    // ─── Events ──────────────────────────────────────────────────────────────
    event TokensMinted(address indexed to, uint256 amount, string reason);

    // ─── Constructor ─────────────────────────────────────────────────────────
    /**
     * @param initialOwner  Deployer / initial treasury address.
     *                      Will receive GENESIS_ALLOC and own the contract
     *                      until ownership is transferred to a DAO Governor.
     */
    constructor(address initialOwner)
        ERC20("SRI Adaptive Response Asset", "SARA")
        ERC20Permit("SRI Adaptive Response Asset")
        Ownable(initialOwner)
    {
        // Genesis mint — 10 % to deployer/treasury at launch
        _mint(initialOwner, GENESIS_ALLOC);
    }

    // ─── Owner-gated minting ─────────────────────────────────────────────────
    /**
     * @notice Mint SARA tokens. Callable by owner (DAO Governor once transferred).
     * @param to     Recipient address (e.g. treasury, vesting contract, reward pool)
     * @param amount Token amount in wei (18 decimals)
     * @param reason Human-readable reason string — indexed in event for off-chain search
     */
    function mint(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyOwner {
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "SARA: exceeds max supply"
        );
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    // ─── OZ v5 required overrides ────────────────────────────────────────────
    // ERC20Votes hooks into _update instead of the v4 _afterTokenTransfer pattern.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    // Both ERC20Permit and ERC20Votes inherit Nonces; resolve the ambiguity.
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
