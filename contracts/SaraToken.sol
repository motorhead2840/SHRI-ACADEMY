// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  SaraToken
 * @notice SRI Adaptive Response Asset (SARA)
 *         Governance + utility ERC-20 token for the SRI Learn platform.
 *
 * ─── Supply ────────────────────────────────────────────────────────────────
 *   Max supply   : 100,000,000 SARA
 *   Genesis mint :  10,000,000 SARA → deployer wallet on construction
 *   Remaining    :  90,000,000 SARA → minted by owner over time (DAO / vesting)
 *
 * ─── Features ──────────────────────────────────────────────────────────────
 *   ERC-20          standard transfers & approvals
 *   ERC-20 Permit   gasless approvals (EIP-2612)
 *   ERC-20 Votes    snapshot voting power for DAO governance
 *   ERC-20 Burnable token holders can burn their own tokens
 *   Ownable2Step    safe two-step ownership transfer (multisig / Governor)
 *
 * ─── Deployment ────────────────────────────────────────────────────────────
 *   Testnet : Ethereum Sepolia
 *   Mainnet : Ethereum (planned)
 *
 *   Constructor arg:  initialOwner — your deployer / treasury wallet address
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

contract SaraToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Ownable2Step {

    // ── Supply constants ────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY       = 100_000_000 * 10 ** 18;
    uint256 public constant GENESIS_MINT     =  10_000_000 * 10 ** 18;
    uint256 public constant TREASURY_ALLOC   =  40_000_000 * 10 ** 18;
    uint256 public constant ECOSYSTEM_ALLOC  =  25_000_000 * 10 ** 18;
    uint256 public constant TEAM_ALLOC       =  15_000_000 * 10 ** 18;
    uint256 public constant COMMUNITY_ALLOC  =  10_000_000 * 10 ** 18;

    // ── Events ──────────────────────────────────────────────────────────────
    event TokensMinted(address indexed to, uint256 amount, string reason);

    // ── Constructor ─────────────────────────────────────────────────────────
    /// @param initialOwner Deployer wallet — receives GENESIS_MINT on deploy.
    constructor(address initialOwner)
        ERC20("SRI Adaptive Response Asset", "SARA")
        ERC20Permit("SRI Adaptive Response Asset")
        Ownable(initialOwner)
    {
        _mint(initialOwner, GENESIS_MINT);
    }

    // ── Owner-gated minting ─────────────────────────────────────────────────
    /// @notice Mint SARA up to MAX_SUPPLY. Only callable by owner.
    /// @param to      Recipient (treasury, vesting contract, reward pool, etc.)
    /// @param amount  Amount in wei (18 decimals)
    /// @param reason  Label emitted in event for off-chain indexing
    function mint(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "SARA: exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    // ── OZ v5 overrides ─────────────────────────────────────────────────────
    // ERC20Votes uses _update (v5 pattern, not _afterTokenTransfer).
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    // ERC20Permit and ERC20Votes both inherit Nonces — resolve ambiguity.
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
