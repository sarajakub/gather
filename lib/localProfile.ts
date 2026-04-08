export const LOCAL_PROFILE_STORAGE_KEY = "gather-local-profile";

export type StoredCategoryTag = {
  id: string;
  label: string;
};

export type StoredOfferEntry = {
  category: string;
  value: string;
  tags: StoredCategoryTag[];
};

export type StoredProfileDocument = {
  profilePhoto: {
    fileName: string | null;
    previewUrl: string | null;
  };
  location: {
    value: string;
    status: "unverified" | "confirmed";
  };
  needs: StoredCategoryTag[];
  offers: StoredOfferEntry[];
  preferences: {
    matchingOptIn: "yes" | "no" | null;
    notificationsOptIn: "yes" | "no" | null;
  };
  tenure: string | null;
  extraContext: string | null;
  skippedFields: string[];
};

export function saveLocalProfile(profile: StoredProfileDocument) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearLocalProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_PROFILE_STORAGE_KEY);
}

export function loadLocalProfile(): StoredProfileDocument | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as StoredProfileDocument;
  } catch {
    return null;
  }
}
