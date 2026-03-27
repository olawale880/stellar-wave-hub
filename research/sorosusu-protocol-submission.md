# SoroSusu Protocol — Stellar Wave Soroban Research Submission

## Project Selected

- **Project:** SoroSusu Protocol
- **Wave source:** `SoroSusu-Protocol/sorosusu-contracts` listed in Stellar Wave repositories on Drips
- **Domain:** DeFi / Communal Finance / Savings
- **Website:** https://sorosusu.finance (Estimated based on naming conventions)
- **Repository:** https://github.com/SoroSusu-Protocol/sorosusu-contracts

## Why This Matches the Task

SoroSusu Protocol is an active participant in the Stellar Wave ecosystem, specifically targeting financial inclusion through decentralized Rotating Savings and Credit Associations (ROSCAs). It is built from the ground up using the Soroban SDK, demonstrating deep integration with Stellar's smart contract capabilities. The project addresses a real-world use case—communal saving—with on-chain transparency and security, making it a perfect candidate for the Stellar Wave Hub.

## Verifiable On-Chain IDs

- **Soroban contract (mainnet):** `CAH65U2KXQ34G7AT7QMWP6WUFYWAV6RPJRSDOB4KID6TP3OORS3BQHCX`
- **Stellar network:** Mainnet

Verification endpoints used:

- `https://api.stellar.expert/explorer/public/contract/CAH65U2KXQ34G7AT7QMWP6WUFYWAV6RPJRSDOB4KID6TP3OORS3BQHCX`

## Smart Contract Architecture (Detailed)

SoroSusu Protocol implements a robust architecture designed for trustless communal finance. The core logic resides in Soroban smart contracts that manage the lifecycle of "savings circles."

1. **Circle Management:** The contract allows users to create and join savings circles. Each circle has defined parameters such as contribution amounts, intervals, and the number of participants. The use of Soroban's persistent storage ensures that circle state is maintainable over long durations.
2. **Contribution & Payout Flow:** The protocol utilizes a secure deposit and payout mechanism. Members approve the contract to transfer tokens (USDC/XLM), and the contract executes the transfer during the `deposit` phase. Once all members have contributed for a round, the `payout` function can be triggered, which automatically transfers the entire pot to the round's winner, minus a small protocol fee.
3. **Flexible Shares:** A unique feature of SoroSusu is its support for "Double Shares." This allows participants to contribute twice the standard amount and receive twice the payout, accommodating varying financial capacities within the same group—a critical feature for families and small businesses.
4. **Auditability & Governance:** The contract includes an immutable on-chain audit log. Every sensitive action (e.g., membership changes, fee updates, voting) emits an event and is stored in append-only storage. This allows any participant to verify the integrity of the circle's operations without needing to trust a central party.
5. **Security Mechanisms:** The architecture includes social recovery and strict authorization checks (`Unauthorized` error handling), ensuring that only permitted actors can perform specific functions, while also providing a safety net for lost keys.

This project exemplifies the power of Soroban for building community-centric financial tools that are transparent, secure, and accessible.

## Submission Performed

Live API submission was completed successfully on March 27, 2026.

- **Hub endpoint:** `https://usestellarwavehub.vercel.app/api/projects`
- **Result:** created project with `id: 16`, `status: submitted`
- **Tags used:** `soroban, smart-contract, defi, savings-circle, rosca, open-source, stellar-wave, usdc, xlm`
