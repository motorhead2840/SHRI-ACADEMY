/**
 * useWallet — MetaMask / EIP-1193 wallet hook for the SARA token interface.
 * Uses ethers v6 BrowserProvider.
 */

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  SARA_ABI,
  SARA_CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_NETWORK_PARAMS,
  formatSara,
  shortenAddress,
} from "@/lib/sara";

export type WalletStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "wrong_network"
  | "not_installed"
  | "error";

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  shortAddress: string | null;
  ethBalance: string | null;
  saraBalance: string | null;
  saraBalanceRaw: bigint | null;
  votingPower: string | null;
  delegate: string | null;
  chainId: number | null;
  errorMessage: string | null;
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
  delegateTo: (address: string) => Promise<void>;
  refresh: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider & {
      on: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener: (event: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWallet(): WalletState {
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [address, setAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [saraBalance, setSaraBalance] = useState<string | null>(null);
  const [saraBalanceRaw, setSaraBalanceRaw] = useState<bigint | null>(null);
  const [votingPower, setVotingPower] = useState<string | null>(null);
  const [delegate, setDelegate] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Fetch balances for a connected address ──────────────────────────────────

  const fetchBalances = useCallback(async (addr: string, provider: ethers.BrowserProvider) => {
    try {
      const [ethBal, network] = await Promise.all([
        provider.getBalance(addr),
        provider.getNetwork(),
      ]);

      const chainIdNum = Number(network.chainId);
      setChainId(chainIdNum);
      setEthBalance(parseFloat(ethers.formatEther(ethBal)).toFixed(4));

      if (chainIdNum !== SEPOLIA_CHAIN_ID) {
        setStatus("wrong_network");
        return;
      }

      // Read SARA balance + voting power if contract is deployed
      if (SARA_CONTRACT_ADDRESS) {
        const contract = new ethers.Contract(SARA_CONTRACT_ADDRESS, SARA_ABI, provider);
        const [balance, votes, delegatee] = await Promise.allSettled([
          contract.balanceOf(addr) as Promise<bigint>,
          contract.getVotes(addr) as Promise<bigint>,
          contract.delegates(addr) as Promise<string>,
        ]);

        if (balance.status === "fulfilled") {
          setSaraBalanceRaw(balance.value);
          setSaraBalance(formatSara(balance.value));
        }
        if (votes.status === "fulfilled") {
          setVotingPower(formatSara(votes.value));
        }
        if (delegatee.status === "fulfilled") {
          setDelegate(delegatee.value);
        }
      } else {
        // Contract not yet deployed — show placeholder
        setSaraBalance("—");
        setVotingPower("—");
      }

      setStatus("connected");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch balances";
      // Clear stale values so the UI does not show outdated data after a failure
      setEthBalance(null);
      setSaraBalance(null);
      setSaraBalanceRaw(null);
      setVotingPower(null);
      setDelegate(null);
      setErrorMessage(msg);
      setStatus("error");
    }
  }, []);

  // ── Connect wallet ──────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setStatus("not_installed");
      setErrorMessage("MetaMask is not installed. Please install it to continue.");
      return;
    }

    setStatus("connecting");
    setErrorMessage(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      await fetchBalances(addr, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      setStatus("error");
      setErrorMessage(msg);
    }
  }, [fetchBalances]);

  // ── Disconnect ──────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    setStatus("idle");
    setAddress(null);
    setEthBalance(null);
    setSaraBalance(null);
    setSaraBalanceRaw(null);
    setVotingPower(null);
    setDelegate(null);
    setChainId(null);
    setErrorMessage(null);
  }, []);

  // ── Switch to Sepolia ───────────────────────────────────────────────────────

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_NETWORK_PARAMS.chainId }],
      } as Parameters<typeof window.ethereum.request>[0]);
    } catch (err: unknown) {
      // Chain not added to MetaMask — add it
      if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [SEPOLIA_NETWORK_PARAMS],
        } as Parameters<typeof window.ethereum.request>[0]);
      }
    }
  }, []);

  // ── Delegate votes ──────────────────────────────────────────────────────────

  const delegateTo = useCallback(async (delegateeAddr: string) => {
    if (!window.ethereum || !SARA_CONTRACT_ADDRESS) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(SARA_CONTRACT_ADDRESS, SARA_ABI, signer);
    const tx = await (contract.delegate as (addr: string) => Promise<ethers.ContractTransactionResponse>)(delegateeAddr);
    await tx.wait();
    setDelegate(delegateeAddr);
  }, []);

  // ── Refresh ─────────────────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    if (!address || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    await fetchBalances(address, provider);
  }, [address, fetchBalances]);

  // ── Listen for account/chain changes ────────────────────────────────────────

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        disconnect();
      } else {
        setAddress(accs[0]);
        const provider = new ethers.BrowserProvider(window.ethereum!);
        fetchBalances(accs[0], provider);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect, fetchBalances]);

  return {
    status,
    address,
    shortAddress: address ? shortenAddress(address) : null,
    ethBalance,
    saraBalance,
    saraBalanceRaw,
    votingPower,
    delegate,
    chainId,
    errorMessage,
    connect,
    disconnect,
    switchToSepolia,
    delegateTo,
    refresh,
  };
}
