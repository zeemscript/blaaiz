# Beam ⚡

> **Get paid as an African.**  
> Real-time payouts, cross-border spending, and milestone escrow — powered end to end by the **Blaaiz Remittance-as-a-Service (RaaS) API**.  
> *Built for the Blaaiz Buildathon · GDG Ilorin.*

---

## 💡 The Thesis: "Getting Paid as an African"

Most cross-border fintech platforms (LemFi, NALA, Afriex) focus on outbound diaspora remittance ("sending money back home"). But as Blaaiz's founder observed:

> *"Most remittance companies only let you send money to Africa — but what about getting paid as an African?"*

Across Africa — and Nigeria in particular, which accounts for ~60% of Sub-Saharan Africa's stablecoin inflows ($59B between 2023–2024 per IMF data) — hundreds of thousands of freelancers, remote contractors, and digital businesses earn in crypto (USDT/USDC) or foreign fiat (USD/GBP).

Yet, getting those earnings into spendable local currency (NGN, KES, GHS) forces them through an inefficient maze: bouncing between crypto exchanges, informal P2P dealers, unstable bank spreads, and high counterparty risk.

**Beam solves this with one unified platform built on Blaaiz's infrastructure.**

---

## 🚀 The Three Core Pillars

Beam provides three distinct, live payment flows accessible in the interactive demo (`/send`):

### 1. ⚡ Instant Payouts (Freelancer & Contractor Receivables)
- **Problem:** US/European clients pay in USD, USDT, or USDC, but the contractor needs local currency in their bank or mobile wallet.
- **Solution:** Beam lets recipients select their preferred rail (Nigerian Bank Transfer, Kenyan M-Pesa, Ghanaian Mobile Money, UK Faster Payments, or US ACH). Blaaiz provides a transparent, real-time exchange rate and fee quote, and settles funds directly to the recipient's account.

### 2. 🌍 Pay Abroad (Spend What You Have, Anywhere)
- **Problem:** An African merchant or traveler holding Naira in Lagos needs to pay a vendor or supplier in Accra or London.
- **Solution:** Pay in local currency (NGN, GHS, KES, GBP, USD); Blaaiz converts and delivers the recipient's required currency automatically without manual exchange hopping.

### 3. 🛡️ Escrow for Cross-Border Hiring (Trust & Milestone Payouts)
- **Problem:** Remote work contracts across borders lack trust. Employers hesitate to pay upfront, and freelancers fear non-payment after work is completed.
- **Solution:**
  1. **Job Funded:** The employer specifies the contract and funds it in USDT/USDC via a dynamic deposit address generated directly by Blaaiz collections.
  2. **Held in Escrow:** Funds are locked in escrow while work is carried out.
  3. **Instant Settlement:** Upon milestone approval, the employer releases the escrow in one click, triggering Blaaiz's complete multi-rail payout directly to the freelancer's local bank or mobile wallet.

---

## 🛠️ Deep Blaaiz API Integration

Beam is not a mock UI; it exercises the **Blaaiz Node.js SDK (`blaaiz-nodejs-sdk`)** across collections, FX quotations, directory lookups, and multi-rail settlements:

| Feature | Blaaiz SDK Method / Endpoint | Purpose |
| :--- | :--- | :--- |
| **Crypto Collections** | `blaaiz.collections.initiateCrypto` | Generates dynamic USDT & USDC deposit addresses on Ethereum, BNB Smart Chain, Tron, and Polygon. |
| **Dynamic Networks** | `blaaiz.collections.getCryptoNetworks` | Fetches live supported blockchain networks for deposit address generation. |
| **Real-time FX & Fees** | `blaaiz.fees.getBreakdown` | Fetches live conversion rates, rail fees, and exact recipient payout calculations. |
| **Bank Directory** | `blaaiz.banks.list({ country })` | Resolves live banking institutions (e.g., Nigeria, United Kingdom). |
| **Mobile Money Directory**| `blaaiz.momoOperators.list({ currency_id })` | Resolves telco mobile money operators (M-Pesa Kenya, MTN/Vodafone Ghana). |
| **Currency Registry** | `blaaiz.currencies.list` | Retrieves supported fiat and digital currency identifiers. |
| **Automated Payouts** | `blaaiz.createCompletePayout` | Provisions customer KYC, debits the source balance/wallet, and dispatches bank transfers, mobile money, or ACH. |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    User["User Interface (Next.js 16 + React 19 + Framer Motion)"]
    API["Secure Internal API Routes (/api/*)"]
    BlaaizSDK["Blaaiz Node.js SDK (blaaiz-nodejs-sdk)"]
    BlaaizAPI["Blaaiz Dev API (api-dev.blaaiz.com)"]
    Settlement["Global Payout Rails (NGN Banks / KES M-Pesa / GHS MoMo / UK Faster Payments / US ACH)"]

    User -->|1. Request Quote / Fetch Banks| API
    API -->|2. Authenticated Calls (OAuth / Client Secret)| BlaaizSDK
    BlaaizSDK -->|3. Collections, FX, Directories, Payouts| BlaaizAPI
    BlaaizAPI -->|4. Automated Settlement| Settlement
```

### Security & Compliance by Design
- **API Secret Isolation:** All Blaaiz API credentials (`BLAAIZ_CLIENT_ID`, `BLAAIZ_CLIENT_SECRET`, `BLAAIZ_WALLET_ID`) remain strictly on the server within Next.js Route Handlers. No secrets or tokens are ever exposed to the client browser.
- **Embedded Compliance:** Utilizes Blaaiz's customer data structure to ensure full KYC alignment during payouts.

---

## 💻 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Components:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (3D perspective tilt cards, spring physics, smooth transitions)
- **Icons:** [HugeIcons](https://hugeicons.com/)
- **SDK:** `blaaiz-nodejs-sdk` (`^1.7.0`)

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- A [Blaaiz Business Sandbox Account](https://business-dev.blaaiz.com)

### 2. Clone & Install

```bash
git clone https://github.com/your-username/blaaiz.git
cd blaaiz
npm install
```

### 3. Environment Configuration

Copy the example environment template:

```bash
cp .env.local.example .env.local
```

Fill in your credentials from the **API & Webhooks** page in your [Blaaiz Dashboard](https://business-dev.blaaiz.com):

```env
# OAuth Credentials (Recommended)
BLAAIZ_CLIENT_ID=your_client_id_here
BLAAIZ_CLIENT_SECRET=your_client_secret_here

# Blaaiz Environment & Wallet
BLAAIZ_API_URL=https://api-dev.blaaiz.com
BLAAIZ_WALLET_ID=your_wallet_id_here
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, or visit [http://localhost:3000/send](http://localhost:3000/send) directly for the live demo.

---

## 📊 Pitch Deck & Presentation

The project includes an interactive 7-slide pitch deck styled with native animations:
- **Interactive Web Pitch:** Open [`pitch/index.html`](file:///Users/macbook2019/Documents/PORT-PROJECTS/blaaiz/pitch/index.html) in any browser (use `ArrowLeft` / `ArrowRight` to navigate).
- **Pitch Deck PDF:** [`pitch/Beam-Pitch.pdf`](file:///Users/macbook2019/Documents/PORT-PROJECTS/blaaiz/pitch/Beam-Pitch.pdf).

---

## 🔮 Roadmap / Production Enhancements

- [x] Full Blaaiz SDK integration (Collections, Quotes, Bank/MoMo directories, Multi-rail payouts).
- [x] Three interactive demo flows: Instant Payout, Pay Abroad, and Escrow.
- [ ] Production webhook signature verification (`x-blaaiz-signature` & `x-blaaiz-timestamp`) for automatic on-chain crypto receipt.
- [ ] Persistent PostgreSQL/Redis database for escrow state (replacing demo memory store).
- [ ] Automated SMS & WhatsApp payment receipts for African beneficiaries.

---

## ⚖️ License

MIT License. Built with ❤️ for the **Blaaiz Buildathon / GDG Ilorin**.
