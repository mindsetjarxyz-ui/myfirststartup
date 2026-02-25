// Ad Management Service
// Manages ad display frequency and localStorage counter
// Uses BOTH ad links alternating for all AI tools

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
  // Alternate: 1st & 4th & 7th... use AD_LINK_1, 2nd & 5th & 8th... use AD_LINK_2 (if they were ads)
  // But since ads only show on 1st, 4th, 7th... we need to alternate those
  // 1st ad (click 1) = Link 1
  // 2nd ad (click 4) = Link 2
  // 3rd ad (click 7) = Link 1
  // 4th ad (click 10) = Link 2
  const adNumber = Math.floor((clickCount - 1) / 3) + 1;
  return adNumber % 2 === 1 ? AD_LINK_1 : AD_LINK_2;
}

// Check if ad should be shown and return updated counter (ALL TOOLS)
export function checkAndUpdateAdCounter(): {
  shouldShowAd: boolean;
  newCount: number;
  adUrl: string;
} {
  const counter = getAdCounter();
  const newCount = counter.clickCount + 1;

  // Show ad on 1st, 4th, 7th, 10th... clicks (1 ad + 2 free = 3 per cycle)
  const shouldShowAd = newCount === 1 || (newCount > 1 && (newCount - 1) % 3 === 0);

  // Get which ad link to use (alternate between both)
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
