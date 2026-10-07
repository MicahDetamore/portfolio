# Portfolio - Jev Integration Quickstart
## Reduce LLM Token Usage in Performance Scoring & Routing

## Problem
Portfolio performance scoring, risk tier assignment, and route decisions use LLM free-text generation, consuming 150-300 tokens per decision.

## Integration: 3 Decision Points

### 1. Performance Score Classification
**Before:** LLM prompt: "Score this performance from 1-10, explain reasoning, include winRate, profitFactor, sharpe"
**After:** Jev `score` primitive

```javascript
import { rateScore } from '/home/quik/Projects/Shared/jev-integration/';

const { value, confidence, legend, probabilities } = await rateScore({
  state: performanceMetrics,
  instructions: 'Score the overall performance (0=terrible, 10=excellent)',
  criteria: ['0-1: Terrible', '1-2: Poor', '2-3: Below Average', '3-4: Average', '4-5: Good', '5-6: Very Good', '6-7: Excellent', '7-8: Outstanding', '8-9: Genius', '9-10: Legendary']
});

// Code thresholds for risk tier assignment
const TIER_POOR = 3;
const TIER_AVERAGE = 5;
const TIER_GOOD = 7;

let riskTier;
if (value <= TIER_POOR) riskTier = 'high-risk';
else if (value <= TIER_AVERAGE) riskTier = 'medium-risk';
else if (value <= TIER_GOOD) riskTier = 'low-risk';
else riskTier = 'very-low-risk';

console.log(`Performance: ${value.toFixed(2)} (${confidence.toFixed(2)} conf) -> ${riskTier}`);
```
**Token savings:** 250 → 50 tokens (80% reduction)

### 2. Strategy Fit Classification
**Before:** LLM prompt: "Does this strategy fit the portfolio? Is it compatible? Explain constraints."
**After:** Jev `selectChoice` primitive

```javascript
import { selectChoice } from '/home/quik/Projects/Shared/jev-integration/';

const { selected, confidence, probabilities } = await selectChoice({
  state: { strategyDesc, portfolioProfile },
  instructions: 'Does this strategy fit the portfolio?',
  criteria: {
    fits: 'Fully compatible, no conflicts, aligns with risk tolerance',
    partial: 'Mostly compatible, minor constraints or adjustments needed',
    conflict: 'Significant conflicts with portfolio objectives or risk limits',
    irrelevant: 'Not relevant to current portfolio strategy'
  }
});

// Deterministic routing
const action = {
  fits: 'authorize deployment',
  partial: 'authorize with conditions and monitoring',
  conflict: 'reject and request revision',
  irrelevant: 'log for future consideration, do not deploy'
}[selected];

if (confidence > 0.8) {
  // High confidence - apply directly
  authorizeStrategy(selected, action);
} else {
  // Medium confidence - review then decide
  reviewStrategy(selected, action);
}
```
**Token savings:** 200 → 55 tokens (73% reduction)

### 3. Decision: Rebalance or Hold
**Before:** LLM prompt: "Should we rebalance the portfolio? What are the tradeoffs? Give a recommendation."
**After:** Jev `shouldActOnDecision` primitive

```javascript
import { shouldActOnDecision } from '/home/quik/Projects/Shared/jev-integration/';

const { value, confidence, shouldAct } = await shouldActOnDecision({
  state: rebalanceAnalysis,
  instructions: 'Should we rebalance the portfolio now?',
  threshold: 0.65  // 65%+ confidence to act
});

if (shouldAct && confidence > 0.75) {
  // High confidence + meets threshold = execute rebalance
  executeRebalance();
} else if (confidence > 0.5) {
  // Medium confidence = wait for more data, monitor
  monitorAndDelay();
} else {
  // Low confidence = hold current allocation
  holdCurrentPosition();
}
```
**Token savings:** 300 → 50 tokens (83% reduction)

### Confidence-Gated Pattern (Portfolio-Specific)

Portfolio decisions require extra care due to financial impact:

```javascript
import { shouldActOnDecision } from '/home/quik/Projects/Shared/jev-integration/';

// Tiered confidence approach for financial decisions

const { confidence, shouldAct } = await shouldActOnDecision({
  state: dailyPnLAnalysis,
  instructions: 'Should we adjust positions today?',
  threshold: 0.8  // Higher threshold for capital allocation decisions
});

// Three-way decision based on both shouldAct AND confidence level
if (shouldAct && confidence > 0.9) {
  // Very high confidence = aggressive action
  executeLargeTrade();
} else if (shouldAct && confidence > 0.75) {
  // High confidence = moderate action
  executeSmallTrade();
} else if (!shouldAct && confidence > 0.5) {
  // Not acting but confident = hold current position
  holdPositions();
} else {
  // Low confidence = no action, wait for more data
  waitAndMonitor();
}
```

### Batch Processing (Multiple Strategies)

```javascript
import { runBatch } from '/home/quik/Projects/Shared/jev-integration/';

const strategies = ['trend-following', 'mean-reversion', 'breakout', 'momentum'];

const batchResults = await runBatch({
  state: strategyEvaluation,
  questions: {
    fitsPortfolio: {
      type: 'noul',
      instructions: 'Does each strategy fit the portfolio?'
    },
    riskTier: {
      type: 'score',
      instructions: 'Risk tier?',
      criteria: ['very-low', 'low', 'medium', 'high', 'very-high']
    }
  }
});

// Single call for N strategies = massive savings
// 1 call vs N LLM calls = (N * 200) → 50 tokens
```

### Opencode Integration

From opencode agents:

```
@jev rateScore state="Portfolio Q3 performance: +12.5% wr, 1.8 pf, 0.95 sharpe" instructions="Score 0-10" criteria="0-10 scale"
@jev selectChoice state="New momentum strategy for tech-heavy portfolio" instructions="Fits?" criteria="fits,partial,conflict,irrelevant"
@jev shouldActOnDecision state="Rebalance $500K portfolio, current drift +3.2%" instructions="Rebalance?" threshold="0.7"
```

### Monitoring Checklist

- [ ] Log Jev `value` + `confidence` + your code's risk tier assignment + actual performance outcome
- [ ] Track: of authorized strategies, what % outperformed the benchmark?
- [ ] Track: of rejected strategies, what % would have outperformed? (false negative rate)
- [ ] Score distribution accuracy: validate Jev scores against classical performance metrics
- [ ] Tier thresholds: validate that risk tier assignments match actual risk realized
- [ ] Domain-tune: different score legends/thresholds for different asset classes (equities vs crypto vs bonds)