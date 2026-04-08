"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { saveLocalProfile } from "@/lib/localProfile";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
};

type OptInChoice = "yes" | "no" | null;

type OfferCategory = "skill" | "craft" | "tool" | "item" | "resource" | "other";

type CategoryTag = {
  id: string;
  label: string;
};

type OfferEntry = {
  category: OfferCategory;
  value: string;
  tags: CategoryTag[];
};

type SignupDraft = {
  profilePhotoName: string | null;
  profilePhotoPreview: string | null;
  location: string;
  locationStatus: "unverified" | "confirmed";
  needs: CategoryTag[];
  offers: OfferEntry[];
  matchingOptIn: OptInChoice;
  notificationsOptIn: OptInChoice;
  extraContext: string;
  skippedFields: string[];
};

type FieldKey =
  | "profilePhoto"
  | "subNeighborhood"
  | "needs"
  | "offers"
  | "matchingOptIn"
  | "notificationsOptIn"
  | "extraContext";

type FieldConfig = {
  key: FieldKey;
  label: string;
  prompt: string;
  clarificationPrompt?: string;
  placeholder?: string;
  required: boolean;
  type: "photo" | "text" | "list" | "opt-in";
};

const FIELD_ORDER: FieldConfig[] = [
  {
    key: "profilePhoto",
    label: "Profile photo",
    prompt:
      "First, please upload a clear photo of yourself. Gather requires a profile photo so neighbors can recognize each other and interactions feel more friendly.",
    required: true,
    type: "photo",
  },
  {
    key: "subNeighborhood",
    label: "Sub-neighborhood",
    prompt:
      "What part of the neighborhood are you in? You can share your sub-neighborhood or a nearby landmark if that feels easier. If the area seems unclear, Gather should confirm it before saving.",
    clarificationPrompt:
      "I need a real neighborhood, sub-neighborhood, cross street, or nearby landmark so I can place you correctly. Could you try that again?",
    placeholder: "For example: Northside, Maple & 3rd, near Riverside Park",
    required: true,
    type: "text",
  },
  {
    key: "needs",
    label: "Needs",
    prompt:
      "What kinds of help might be useful for you right now? A short list is perfect, and if you do not need anything yet you can say 'none right now'.",
    clarificationPrompt:
      "I need at least one actual kind of help, or you can say 'none right now' if you do not need support at the moment.",
    placeholder: "Examples: borrowing tools, gardening advice",
    required: true,
    type: "list",
  },
  {
    key: "offers",
    label: "Offers",
    prompt:
      "What could you offer neighbors? This can be a skill, craft, tool or item to share, produce from a tree or garden, or another resource.",
    clarificationPrompt:
      "I need at least one real offer, like a skill, advice, a tool to share, produce, or another resource you would feel comfortable offering.",
    placeholder: "Examples: sewing help, ladder to borrow, oranges from my tree, tutoring",
    required: true,
    type: "list",
  },
  {
    key: "matchingOptIn",
    label: "Matching opt-in",
    prompt:
      "Would you like Gather to match you with nearby requests that fit your profile?",
    required: true,
    type: "opt-in",
  },
  {
    key: "notificationsOptIn",
    label: "Notifications opt-in",
    prompt:
      "Would you like to get notifications when there is a relevant request or opportunity to help nearby?",
    required: true,
    type: "opt-in",
  },
  {
    key: "extraContext",
    label: "Extra context",
    prompt:
      "Optional: anything else you want neighbors to know about how you like to give or receive support?",
    clarificationPrompt:
      "You can share a brief note about preferences, availability, or communication style, or skip this question.",
    placeholder: "Anything that helps make matching more useful",
    required: false,
    type: "text",
  },
];

const INITIAL_DRAFT: SignupDraft = {
  profilePhotoName: null,
  profilePhotoPreview: null,
  location: "",
  locationStatus: "unverified",
  needs: [],
  offers: [],
  matchingOptIn: null,
  notificationsOptIn: null,
  extraContext: "",
  skippedFields: [],
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "intro",
    role: "assistant",
    content:
      "Welcome to Gather. I will help you set up a short profile so neighbors can recognize you. We will keep this brief, and you can skip any optional question.",
  },
  {
    id: "profilePhoto-prompt",
    role: "assistant",
    content: FIELD_ORDER[0].prompt,
  },
];

function parseCommaSeparatedList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function looksLikeFiller(value: string): boolean {
  const lower = value.trim().toLowerCase();
  const fillerPhrases = [
    "idk",
    "i dont know",
    "i don't know",
    "whatever",
    "something",
    "stuff",
    "n/a",
    "na",
    "none",
    "asdf",
    "test",
    "maybe",
  ];

  return fillerPhrases.includes(lower);
}

function normalizeOfferCategory(value: string): OfferCategory {
  const lower = value.toLowerCase();

  if (
    lower.includes("craft") ||
    lower.includes("sew") ||
    lower.includes("knit") ||
    lower.includes("art")
  ) {
    return "craft";
  }

  if (
    lower.includes("tool") ||
    lower.includes("hammer") ||
    lower.includes("ladder") ||
    lower.includes("drill") ||
    lower.includes("shovel")
  ) {
    return "tool";
  }

  if (
    lower.includes("item") ||
    lower.includes("chair") ||
    lower.includes("table") ||
    lower.includes("stroller")
  ) {
    return "item";
  }

  if (
    lower.includes("garden") ||
    lower.includes("fruit") ||
    lower.includes("produce") ||
    lower.includes("resource")
  ) {
    return "resource";
  }

  return "skill";
}

function normalizeShortLabel(value: string, fallbackCategory: OfferCategory): string {
  const lower = value.toLowerCase();

  if (lower.includes("fruit") || lower.includes("orange") || lower.includes("lemon")) {
    return "Fruit share";
  }

  if (lower.includes("garden") || lower.includes("yard") || lower.includes("plant")) {
    return "Garden help";
  }

  if (
    lower.includes("art") ||
    lower.includes("craft") ||
    lower.includes("sew") ||
    lower.includes("knit")
  ) {
    return "Arts & crafts";
  }

  if (
    lower.includes("tutor") ||
    lower.includes("teach") ||
    lower.includes("homework") ||
    lower.includes("language")
  ) {
    return "Tutoring help";
  }

  if (
    lower.includes("meal") ||
    lower.includes("food") ||
    lower.includes("cook") ||
    lower.includes("grocery")
  ) {
    return "Meal support";
  }

  if (
    lower.includes("pet") ||
    lower.includes("dog") ||
    lower.includes("cat") ||
    lower.includes("walk")
  ) {
    return "Pet care";
  }

  if (
    lower.includes("child") ||
    lower.includes("babysit") ||
    lower.includes("care") ||
    lower.includes("school pickup")
  ) {
    return "Childcare help";
  }

  if (
    lower.includes("ride") ||
    lower.includes("driver") ||
    lower.includes("transport") ||
    lower.includes("carpool")
  ) {
    return "Ride support";
  }

  if (
    lower.includes("tool") ||
    lower.includes("hammer") ||
    lower.includes("ladder") ||
    lower.includes("drill") ||
    lower.includes("shovel")
  ) {
    return "Tool share";
  }

  if (
    lower.includes("item") ||
    lower.includes("stroller") ||
    lower.includes("chair") ||
    lower.includes("table")
  ) {
    return "Item share";
  }

  switch (fallbackCategory) {
    case "craft":
      return "Arts & crafts";
    case "tool":
      return "Tool share";
    case "item":
      return "Item share";
    case "resource":
      return "Resource share";
    case "other":
      return "Other";
    case "skill":
    default:
      return "Skill share";
  }
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function createFallbackTag(value: string, fallbackCategory: OfferCategory): CategoryTag {
  const trimmed = value.trim();
  const normalized = normalizeShortLabel(trimmed, fallbackCategory);

  if (normalized !== "Skill share") {
    return {
      id: normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: normalized,
    };
  }

  const titled = toTitleCase(trimmed);
  const hasPluralResourceSignal =
    fallbackCategory === "resource" ||
    /\b(supplies|items|tools|resources|goods|produce)\b/i.test(trimmed);

  const label = hasPluralResourceSignal ? titled : `${titled} share`;

  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
  };
}

const TAG_RULES: Array<{ id: string; label: string; keywords: string[] }> = [
  {
    id: "food-support",
    label: "Food support",
    keywords: ["food", "grocery", "meal", "cook", "hungry", "pantry"],
  },
  {
    id: "transportation",
    label: "Transportation",
    keywords: ["ride", "transport", "car", "bus", "pickup", "dropoff", "carpool"],
  },
  {
    id: "childcare",
    label: "Childcare",
    keywords: ["child", "kid", "babysit", "school", "after school", "daycare"],
  },
  {
    id: "pet-care",
    label: "Pet care",
    keywords: ["pet", "dog", "cat", "walk", "litter", "pet sit"],
  },
  {
    id: "home-repair",
    label: "Home repair",
    keywords: ["repair", "fix", "handyman", "plumb", "electrical", "maintenance"],
  },
  {
    id: "yard-garden",
    label: "Yard & garden",
    keywords: ["garden", "yard", "plant", "weed", "lawn", "fruit tree"],
  },
  {
    id: "tool-share",
    label: "Tool share",
    keywords: ["tool", "hammer", "ladder", "drill", "shovel", "saw", "borrow"],
  },
  {
    id: "item-share",
    label: "Item share",
    keywords: ["item", "stroller", "chair", "table", "furniture", "borrow"],
  },
  {
    id: "arts-crafts",
    label: "Arts & crafts",
    keywords: ["art", "craft", "sew", "knit", "paint", "crochet"],
  },
  {
    id: "tutoring",
    label: "Tutoring",
    keywords: ["tutor", "teach", "homework", "reading", "math", "language"],
  },
  {
    id: "elder-support",
    label: "Elder support",
    keywords: ["elder", "senior", "aging", "check in", "companionship"],
  },
  {
    id: "wellness",
    label: "Wellness",
    keywords: ["health", "wellness", "mental", "therapy", "care", "support"],
  },
  {
    id: "resource-share",
    label: "Resource share",
    keywords: ["resource", "produce", "fruit", "share", "donate"],
  },
];

function dedupeTags(tags: CategoryTag[]): CategoryTag[] {
  const seen = new Set<string>();

  return tags.filter((tag) => {
    if (seen.has(tag.id)) {
      return false;
    }

    seen.add(tag.id);
    return true;
  });
}

function categorizeEntry(value: string, fallbackCategory: OfferCategory): CategoryTag[] {
  const lower = value.toLowerCase();
  const matches = TAG_RULES.filter((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword)),
  ).map((rule) => ({
    id: rule.id,
    label: rule.label,
  }));

  if (matches.length > 0) {
    return dedupeTags(matches);
  }

  return [createFallbackTag(value, fallbackCategory)];
}

function parseNeeds(value: string): CategoryTag[] {
  if (value.trim().toLowerCase() === "none right now") {
    return [{ id: "no-current-requests", label: "No current requests" }];
  }

  return dedupeTags(
    parseCommaSeparatedList(value).flatMap((entry) => categorizeEntry(entry, "skill")),
  );
}

function parseOffers(value: string): OfferEntry[] {
  return parseCommaSeparatedList(value).map((entry) => {
    const detectedCategory = normalizeOfferCategory(entry);
    const category: OfferCategory =
      detectedCategory === "skill" ? "other" : detectedCategory;

    return {
      category,
      value: entry,
      tags: categorizeEntry(entry, category),
    };
  });
}

function isFieldComplete(field: FieldKey, draft: SignupDraft): boolean {
  switch (field) {
    case "profilePhoto":
      return Boolean(draft.profilePhotoName);
    case "subNeighborhood":
      return draft.location.trim().length > 0;
    case "needs":
      return draft.needs.length > 0;
    case "offers":
      return draft.offers.length > 0;
    case "matchingOptIn":
      return draft.matchingOptIn !== null;
    case "notificationsOptIn":
      return draft.notificationsOptIn !== null;
    case "extraContext":
      return draft.extraContext.trim().length > 0;
    default:
      return false;
  }
}

function shouldAskField(field: FieldConfig, draft: SignupDraft): boolean {
  return !isFieldComplete(field.key, draft) && !draft.skippedFields.includes(field.key);
}

function getNextField(draft: SignupDraft): FieldConfig | null {
  return FIELD_ORDER.find((field) => shouldAskField(field, draft)) ?? null;
}

function areRequiredFieldsComplete(draft: SignupDraft): boolean {
  return FIELD_ORDER.filter((field) => field.required).every((field) =>
    isFieldComplete(field.key, draft),
  );
}

function buildProfileDocument(draft: SignupDraft) {
  return {
    profilePhoto: {
      fileName: draft.profilePhotoName,
      previewUrl: draft.profilePhotoPreview,
    },
    location: {
      value: draft.location,
      status: draft.locationStatus,
    },
    needs: draft.needs,
    offers: draft.offers,
    preferences: {
      matchingOptIn: draft.matchingOptIn,
      notificationsOptIn: draft.notificationsOptIn,
    },
    extraContext: draft.extraContext || null,
    skippedFields: draft.skippedFields,
  };
}

function validateResponse(field: FieldConfig, value: string): { ok: boolean; message?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      ok: false,
      message: field.clarificationPrompt ?? "Please share a little more so I can save this.",
    };
  }

  if (looksLikeFiller(trimmed)) {
    return {
      ok: false,
      message: field.clarificationPrompt ?? "That does not look like a complete answer yet.",
    };
  }

  switch (field.key) {
    case "subNeighborhood": {
      const hasLetters = /[a-z]/i.test(trimmed);
      const usefulLength = trimmed.length >= 4;
      const hasPlaceSignal =
        trimmed.includes("&") ||
        trimmed.includes("near") ||
        trimmed.split(" ").length >= 2;

      if (!hasLetters || !usefulLength || !hasPlaceSignal) {
        return { ok: false, message: field.clarificationPrompt };
      }

      return { ok: true };
    }
    case "needs": {
      if (trimmed.toLowerCase() === "none right now") {
        return { ok: true };
      }

      const parsed = parseCommaSeparatedList(trimmed);

      if (parsed.length === 0 || parsed.every((entry) => entry.length < 4)) {
        return { ok: false, message: field.clarificationPrompt };
      }

      return { ok: true };
    }
    case "offers": {
      const parsed = parseCommaSeparatedList(trimmed);

      if (parsed.length === 0 || parsed.every((entry) => entry.length < 4)) {
        return { ok: false, message: field.clarificationPrompt };
      }

      if (parsed.some((entry) => entry.toLowerCase() === "none right now")) {
        return {
          ok: false,
          message:
            "For offers, I need something you would actually be comfortable sharing or helping with. If you are not ready yet, we may want to make this optional later.",
        };
      }

      return { ok: true };
    }
    case "extraContext":
      return trimmed.length < 5
        ? { ok: false, message: field.clarificationPrompt }
        : { ok: true };
    default:
      return { ok: true };
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read selected image."));
    };

    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
}

export default function SignupConversation() {
  const [draft, setDraft] = useState<SignupDraft>(INITIAL_DRAFT);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const nextField = useMemo(() => getNextField(draft), [draft]);
  const canFinish = areRequiredFieldsComplete(draft);
  const profileDocument = useMemo(() => buildProfileDocument(draft), [draft]);

  function appendUserMessage(content: string) {
    setMessages((current) => [
      ...current,
      { id: `user-${crypto.randomUUID()}`, role: "user", content },
    ]);
  }

  function appendAssistantMessage(content: string) {
    setMessages((current) => [
      ...current,
      { id: `assistant-${crypto.randomUUID()}`, role: "assistant", content },
    ]);
  }

  function queueNextPrompt(nextDraft: SignupDraft, acknowledgement: string) {
    const upcomingField = getNextField(nextDraft);

    if (!upcomingField) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${crypto.randomUUID()}`,
          role: "assistant",
          content: acknowledgement,
        },
        {
          id: `assistant-${crypto.randomUUID()}`,
          role: "assistant",
          content:
            "That covers everything for now. Your signup summary is ready to review below.",
        },
      ]);
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `assistant-${crypto.randomUUID()}`,
        role: "assistant",
        content: acknowledgement,
      },
      {
        id: `${upcomingField.key}-prompt-${crypto.randomUUID()}`,
        role: "assistant",
        content: upcomingField.prompt,
      },
    ]);
    setInput("");
  }

  async function handlePhotoSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = await fileToDataUrl(file);

      setDraft((current) => ({
        ...current,
        profilePhotoName: file.name,
        profilePhotoPreview: previewUrl,
        skippedFields: current.skippedFields.filter((field) => field !== "profilePhoto"),
      }));

      appendUserMessage(`Uploaded profile photo: ${file.name}`);
      const nextDraft: SignupDraft = {
        ...draft,
        profilePhotoName: file.name,
        profilePhotoPreview: previewUrl,
        skippedFields: draft.skippedFields.filter((field) => field !== "profilePhoto"),
      };
      queueNextPrompt(nextDraft, "Perfect. Your photo is set.");
    } catch {
      appendAssistantMessage("I couldn't read that image. Please try choosing another photo.");
    } finally {
      event.target.value = "";
    }
  }

  function applyFieldValue(field: FieldKey, value: string) {
    setDraft((current) => {
      const nextDraft = {
        ...current,
        skippedFields: current.skippedFields.filter((item) => item !== field),
      };

      switch (field) {
        case "subNeighborhood":
          nextDraft.location = value.trim();
          nextDraft.locationStatus = "confirmed";
          return nextDraft;
        case "needs":
          nextDraft.needs = parseNeeds(value);
          return nextDraft;
        case "offers":
          nextDraft.offers = parseOffers(value);
          return nextDraft;
        case "extraContext":
          nextDraft.extraContext = value.trim();
          return nextDraft;
        default:
          return nextDraft;
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nextField || nextField.type === "photo") return;

    const trimmed = input.trim();
    if (!trimmed) return;

    appendUserMessage(trimmed);

    if (nextField.type === "opt-in") {
      const normalized = trimmed.toLowerCase();
      const choice: OptInChoice =
        normalized.startsWith("y") ? "yes" : normalized.startsWith("n") ? "no" : null;

      if (!choice) {
        appendAssistantMessage("Please answer with yes or no for this one.");
        return;
      }

      const nextDraft: SignupDraft = {
        ...draft,
        [nextField.key]: choice,
        skippedFields: draft.skippedFields.filter((field) => field !== nextField.key),
      };
      setDraft(nextDraft);
      queueNextPrompt(nextDraft, "Thanks. I have that saved.");
      return;
    }

    const validation = validateResponse(nextField, trimmed);
    if (!validation.ok) {
      appendAssistantMessage(
        validation.message ?? "I need a little more detail before I can save that.",
      );
      return;
    }

    applyFieldValue(nextField.key, trimmed);
    const nextDraft = {
      ...draft,
      skippedFields: draft.skippedFields.filter((field) => field !== nextField.key),
    };

    switch (nextField.key) {
      case "subNeighborhood":
        nextDraft.location = trimmed;
        nextDraft.locationStatus = "confirmed";
        break;
      case "needs":
        nextDraft.needs = parseNeeds(trimmed);
        break;
      case "offers":
        nextDraft.offers = parseOffers(trimmed);
        break;
      case "extraContext":
        nextDraft.extraContext = trimmed;
        break;
      default:
        break;
    }

    queueNextPrompt(nextDraft, "Thanks. I have that saved.");
  }

  function handleSkip() {
    if (!nextField || nextField.required) return;

    const nextDraft: SignupDraft = {
      ...draft,
      skippedFields: Array.from(new Set([...draft.skippedFields, nextField.key])),
    };
    setDraft(nextDraft);
    appendUserMessage(`Skipped ${nextField.label.toLowerCase()}.`);
    queueNextPrompt(nextDraft, "No problem. We can come back to that later.");
  }

  function handleOptIn(choice: Exclude<OptInChoice, null>) {
    if (!nextField || nextField.type !== "opt-in") return;

    appendUserMessage(choice === "yes" ? "Yes" : "No");
    const nextDraft: SignupDraft = {
      ...draft,
      [nextField.key]: choice,
      skippedFields: draft.skippedFields.filter((field) => field !== nextField.key),
    };
    setDraft(nextDraft);
    queueNextPrompt(nextDraft, "Thanks. I have that saved.");
  }

  function handleFinish() {
    if (!canFinish) return;

    saveLocalProfile(profileDocument);
    setIsComplete(true);
    appendAssistantMessage("Your core signup profile is complete.");
  }

  return (
    <div className="min-h-screen bg-[#f6f8f2] px-4 py-10 text-[#1e3010] sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <section className="overflow-hidden rounded-[28px] border border-[#dfe7d6] bg-white shadow-[0_18px_60px_rgba(30,48,16,0.08)]">
          <div className="border-b border-[#eceee8] bg-[linear-gradient(135deg,#f2f7ee_0%,#fff5f0_100%)] px-6 py-6">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#7a8870]">
              Gather signup
            </p>
            <h1 className="mt-2 text-3xl leading-tight">
              A short conversation to set up your neighbor profile
            </h1>
          </div>

          <div className="space-y-4 bg-[#fcfdf9] px-4 py-5 sm:px-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "assistant"
                      ? "bg-[#f2f7ee] text-[#1e3010]"
                      : "bg-[#e8855a] text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#eceee8] bg-white px-4 py-5 sm:px-6">
            {isComplete ? (
              <div className="rounded-[20px] border border-[#dfe7d6] bg-[#f8fbf5] p-4">
                <p className="text-sm font-medium text-[#3d6828]">Profile complete</p>
                <p className="mt-2 text-sm leading-6 text-[#5a6553]">
                  Your signup is complete and your profile is ready to view.
                </p>
                <div className="mt-4">
                  <Link
                    href="/profile"
                    className="inline-flex rounded-full border border-[#c7d0bf] bg-white px-5 py-3 text-sm font-medium text-[#1e3010] transition hover:border-[#3d6828]"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            ) : !nextField ? (
              <div className="rounded-[20px] border border-[#dfe7d6] bg-[#f8fbf5] p-4">
                <p className="text-sm font-medium text-[#3d6828]">Conversation complete</p>
                <p className="mt-2 text-sm leading-6 text-[#5a6553]">
                  There are no more signup questions right now. Review the summary and use Finish
                  signup to lock in the core profile.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f2f7ee] px-3 py-1 text-xs font-medium text-[#3d6828]">
                    Profile ready for review
                  </span>
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={!canFinish}
                    className="rounded-full border border-[#c7d0bf] bg-white px-5 py-3 text-sm font-medium text-[#1e3010] transition enabled:hover:border-[#3d6828] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Finish signup
                  </button>
                </div>
              </div>
            ) : (
              <>
                {nextField.type === "photo" ? (
                  <div className="rounded-[20px] border border-dashed border-[#c8d5bb] bg-[#f8fbf5] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#1e3010]">Upload profile photo</p>
                        <p className="mt-1 text-sm text-[#5a6553]">
                          This is required so neighbors can recognize each other.
                        </p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#3d6828] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#335723]">
                        Choose photo
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handlePhotoSelected}
                        />
                      </label>
                    </div>
                    {draft.profilePhotoPreview ? (
                      <div className="mt-4 flex items-center gap-4 rounded-[16px] bg-white p-3">
                        <Image
                          src={draft.profilePhotoPreview}
                          alt="Profile preview"
                          width={64}
                          height={64}
                          unoptimized
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1e3010]">
                            {draft.profilePhotoName}
                          </p>
                          <p className="text-sm text-[#5a6553]">Photo selected</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : nextField.type === "opt-in" ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleOptIn("yes")}
                        className="rounded-full bg-[#3d6828] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#335723]"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptIn("no")}
                        className="rounded-full border border-[#c7d0bf] bg-white px-5 py-3 text-sm font-medium text-[#1e3010] transition hover:border-[#3d6828]"
                      >
                        No
                      </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <label className="sr-only" htmlFor="signup-input">
                        Reply
                      </label>
                      <input
                        id="signup-input"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Or type yes or no"
                        className="w-full rounded-[16px] border border-[#d7ddd0] bg-white px-4 py-3 text-sm text-[#1e3010] outline-none transition focus:border-[#3d6828]"
                      />
                    </form>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <label className="sr-only" htmlFor="signup-input">
                      Reply
                    </label>
                    <textarea
                      id="signup-input"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={nextField.placeholder ?? "Type your reply"}
                      rows={3}
                      className="w-full resize-none rounded-[18px] border border-[#d7ddd0] bg-[#fcfdf9] px-4 py-3 text-sm leading-6 text-[#1e3010] outline-none transition focus:border-[#3d6828]"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="rounded-full bg-[#e8855a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#d9764d]"
                      >
                        Send
                      </button>
                      {!nextField.required ? (
                        <button
                          type="button"
                          onClick={handleSkip}
                          className="rounded-full border border-[#c7d0bf] bg-white px-5 py-3 text-sm font-medium text-[#1e3010] transition hover:border-[#3d6828]"
                        >
                          Skip for now
                        </button>
                      ) : null}
                    </div>
                  </form>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#eceee8] pt-4">
                  <span className="rounded-full bg-[#f2f7ee] px-3 py-1 text-xs font-medium text-[#3d6828]">
                    {canFinish ? "Core requirements complete" : "Collecting required profile data"}
                  </span>
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={!canFinish}
                    className="rounded-full border border-[#c7d0bf] bg-white px-5 py-3 text-sm font-medium text-[#1e3010] transition enabled:hover:border-[#3d6828] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Finish signup
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[28px] border border-[#dfe7d6] bg-white p-5 shadow-[0_12px_32px_rgba(30,48,16,0.06)]">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#7a8870]">
              Signup summary
            </p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-[#7a8870]">Photo</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.profilePhotoPreview ? (
                    <div className="flex items-center gap-3">
                      <Image
                        src={draft.profilePhotoPreview}
                        alt="Profile summary preview"
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <span>{draft.profilePhotoName}</span>
                    </div>
                  ) : (
                    "Required"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[#7a8870]">Sub-neighborhood</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.location || "Required"}
                  {draft.location ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#c7d0bf] bg-[#f8fbf5] px-3 py-1 text-xs font-medium text-[#3d6828]">
                        {draft.locationStatus === "confirmed"
                          ? "Location confirmed"
                          : "Needs confirmation"}
                      </span>
                    </div>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-[#7a8870]">Needs</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.needs.length ? (
                    <div className="flex flex-wrap gap-2">
                      {draft.needs.map((need) => (
                        <span
                          key={need.id}
                          className="rounded-full border border-[#c7d0bf] bg-[#f8fbf5] px-3 py-1 text-xs font-medium text-[#3d6828]"
                        >
                          {need.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Required"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[#7a8870]">Offers</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.offers.length ? (
                    <div className="flex flex-wrap gap-2">
                      {dedupeTags(draft.offers.flatMap((offer) => offer.tags)).map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border border-[#f0c2af] bg-[#fff5f0] px-3 py-1 text-xs font-medium text-[#b45d36]"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Required"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[#7a8870]">Matching</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.matchingOptIn ? draft.matchingOptIn : "Required"}
                </dd>
              </div>
              <div>
                <dt className="text-[#7a8870]">Notifications</dt>
                <dd className="mt-1 text-[#1e3010]">
                  {draft.notificationsOptIn ? draft.notificationsOptIn : "Required"}
                </dd>
              </div>
            </dl>
          </div>

        </aside>
      </div>
    </div>
  );
}
