// Ad Management Service
// Pattern: Click Generate → Ad shows → Come back → 1 free generation → Next click shows ad → Repeat

const AD_LINK_1 = "https://omg10.com/4/10649293";
const AD_LINK_2 = "https://omg10.com/4/10649295";
const AD_COUNTER_KEY = "ai_tools_ad_counter";

export interface AdCounterState {
  clickCount: number;
  lastReset: number;
}

// Get current counter from localStorage
export function getAdCounter(): AdCounterState {
  try {
    const stored = localStorage.getItem(AD_COUNTER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading ad counter:", error);
  }
  
  return {
    clickCount: 0,
    lastReset: Date.now(),
  };
}

// Save counter to localStorage
function saveAdCounter(counter: AdCounterState): void {
  try {
    localStorage.setItem(AD_COUNTER_KEY, JSON.stringify(counter));
  } catch (error) {
    console.error("Error saving ad counter:", error);
  }
}

// Determine which ad link to use (alternate between link 1 and 2)
function getAdLinkForClick(clickCount: number): string {
  // Pattern: Ad on click 1, 3, 5, 7, 9... (odd clicks)
  // Link 1 on 1st, 5th, 9th... ads
  // Link 2 on 3rd, 7th, 11th... ads
  const adNumber = Math.floor((clickCount + 1) / 2);
  return adNumber % 2 === 1 ? AD_LINK_1 : AD_LINK_2;
}

// Check if ad should be shown and return updated counter
// Pattern: Ad shows on every odd click (1st, 3rd, 5th, 7th...)
export function checkAndUpdateAdCounter(): {
  shouldShowAd: boolean;
  newCount: number;
  adUrl: string;
} {
  const counter = getAdCounter();
  const newCount = counter.clickCount + 1;

  // Show ad on odd clicks: 1, 3, 5, 7, 9... (Click → Ad → 1 Free → Click → Ad → 1 Free...)
  const shouldShowAd = newCount % 2 === 1;

  // Get which ad link to use
  const adUrl = getAdLinkForClick(newCount);

  // Save updated counter
  const updatedCounter: AdCounterState = {
    clickCount: newCount,
    lastReset: counter.lastReset,
  };
  saveAdCounter(updatedCounter);

  return {
    shouldShowAd,
    newCount,
    adUrl,
  };
}

// Open ad in new tab with appropriate link
export function openAdInNewTab(adUrl?: string): void {
  try {
    const url = adUrl || AD_LINK_1;
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error opening ad:", error);
  }
}

// Reset counter (useful for testing)
export function resetAdCounter(): void {
  try {
    localStorage.removeItem(AD_COUNTER_KEY);
  } catch (error) {
    console.error("Error resetting ad counter:", error);
  }
}
