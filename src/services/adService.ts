// Ad Management Service
// Manages ad display frequency and localStorage counter

const AD_LINK_1 = "https://omg10.com/4/10649293"; // For first set of tools
const AD_LINK_2 = "https://omg10.com/4/10649295"; // For second set of tools
const AD_COUNTER_KEY = "ai_tools_ad_counter";
const AD_COUNTER_KEY_IMAGE = "ai_tools_ad_counter_images";

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

// Get image tools counter
export function getAdCounterImage(): AdCounterState {
  try {
    const stored = localStorage.getItem(AD_COUNTER_KEY_IMAGE);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading image ad counter:", error);
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

// Save image counter
function saveAdCounterImage(counter: AdCounterState): void {
  try {
    localStorage.setItem(AD_COUNTER_KEY_IMAGE, JSON.stringify(counter));
  } catch (error) {
    console.error("Error saving image ad counter:", error);
  }
}

// Check if ad should be shown and return updated counter (Standard tools)
export function checkAndUpdateAdCounter(): {
  shouldShowAd: boolean;
  newCount: number;
  adUrl: string;
} {
  const counter = getAdCounter();
  const newCount = counter.clickCount + 1;

  // Show ad on 1st, 4th, 7th, 10th... clicks (1 ad + 2 free = 3 per cycle)
  const shouldShowAd = newCount === 1 || (newCount > 1 && (newCount - 1) % 3 === 0);

  // Save updated counter
  const updatedCounter: AdCounterState = {
    clickCount: newCount,
    lastReset: counter.lastReset,
  };
  saveAdCounter(updatedCounter);

  return {
    shouldShowAd,
    newCount,
    adUrl: AD_LINK_1,
  };
}

// Check if ad should be shown (Image tools)
export function checkAndUpdateAdCounterImageTools(): {
  shouldShowAd: boolean;
  newCount: number;
  adUrl: string;
} {
  const counter = getAdCounterImage();
  const newCount = counter.clickCount + 1;

  // Show ad on 1st, 4th, 7th, 10th... clicks
  const shouldShowAd = newCount === 1 || (newCount > 1 && (newCount - 1) % 3 === 0);

  // Save updated counter
  const updatedCounter: AdCounterState = {
    clickCount: newCount,
    lastReset: counter.lastReset,
  };
  saveAdCounterImage(updatedCounter);

  return {
    shouldShowAd,
    newCount,
    adUrl: AD_LINK_2,
  };
}

// Open ad in new tab (Standard tools)
export function openAdInNewTab(): void {
  try {
    window.open(AD_LINK_1, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error opening ad:", error);
  }
}

// Open ad in new tab (Image tools)
export function openAdInNewTabImageTools(): void {
  try {
    window.open(AD_LINK_2, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error opening ad:", error);
  }
}

// Reset counter (useful for testing)
export function resetAdCounter(): void {
  try {
    localStorage.removeItem(AD_COUNTER_KEY);
    localStorage.removeItem(AD_COUNTER_KEY_IMAGE);
  } catch (error) {
    console.error("Error resetting ad counter:", error);
  }
}
