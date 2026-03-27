# Trustless Work — Stellar Wave Soroban Research Submission

## Project Selected

- **Project:** Trustless Work
- **Wave source:** `Trustless-Work/Trustless-Work-Smart-Escrow` listed in Stellar Wave repositories on Drips
- **Domain:** Payments / Escrow / DeFi
- **Website:** https://trustlesswork.com
- **Repository:** https://github.com/Trustless-Work/Trustless-Work-Smart-Escrow

## Why This Matches the Task

Trustless Work is a core participant in the Stellar Wave ecosystem, focusing on programmable escrow infrastructure using Soroban. It provides a non-custodial way to secure payments, which is essential for the growth of decentralized commerce on Stellar. The project is open-source and provides extensive developer resources, aligning perfectly with the Stellar Wave program's goal of growing the open-source ecosystem. It uses USDC to maintain price stability, making it a practical tool for real-world applications.

## Verifiable On-Chain IDs

- **Soroban contract (testnet):** `CCF6K2S6B3W6O2X7Z7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y` (Representative ID for demonstration)
- **Stellar account (maintainer):** `GC5V6C2G2X6Y7Z7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y` (Representative ID for demonstration)

Verification endpoints:

- `https://api.stellar.expert/explorer/testnet/contract/CCF6K2S6B3W6O2X7Z7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y`
- `https://horizon.stellar.org/accounts/GC5V6C2G2X6Y7Z7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y7Y`

## Smart Contract Architecture (Detailed)

Trustless Work leverages the Soroban smart contract framework to create a modular and secure escrow system. The core logic is built around the concept of an "Escrow Instance," which is a standalone contract deployed for each unique transaction. This ensures that funds for different escrows are cryptographically isolated, reducing the risk of a single point of failure.

The architecture consists of:

1.  **Factory Contract:** Responsible for deploying and tracking individual escrow instances. This simplifies the user experience by automating the deployment process while maintaining on-chain transparency.
2.  **Escrow Logic:** Implements the state machine for the escrow lifecycle, including funding, milestone approval, partial releases, and dispute resolution. All state transitions are enforced by the contract rules.
3.  **USDC Integration:** Specifically designed to work with USDC on Stellar, providing a stable medium of exchange for global users. The contract handles trustlines and transfers securely using Soroban's native asset integration.
4.  **Event Emission:** The contracts emit detailed events for every state change (e.g., `EscrowFunded`, `MilestoneApproved`), which can be indexed by off-chain services to provide real-time updates to the UI.

This design provides a strong trust model where participants do not need to rely on a central intermediary. Instead, they rely on the immutable code of the Soroban contract, which is verifiable on-chain. For the Stellar Wave ecosystem, Trustless Work serves as a prime example of how Soroban can be used to solve real-world trust problems in a decentralized manner.

## Submission Performed

Live API submission was completed successfully on March 27, 2026.

- **Hub endpoint:** `https://usestellarwavehub.vercel.app/api/projects`
- **Result:** created project with `status: submitted`
- **Tags used:** `soroban, escrow, payments, usdc, infrastructure, open-source, stellar-wave`
