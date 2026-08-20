export type HumanShape = "star" | "circle" | "square" | "triangle" | "heart" | "diamond";

export const HUMAN_SHAPE_COLORS: Record<HumanShape, string> = {
  circle: "#64748b",
  square: "#64748b",
  triangle: "#64748b",
  star: "#64748b",
  heart: "#64748b",
  diamond: "#64748b",
};

export type HumanOption = {
  id: string;
  swatch?: string;
  shape?: HumanShape;
};

export type HumanChallengeType = "color" | "shape";

export type HumanChallenge = {
  questionId: string;
  type: HumanChallengeType;
  answer: string;
  targetKey: string;
  options: HumanOption[];
};

const COLOR_SWATCHES = [
  { id: "blue", swatch: "#3b82f6" },
  { id: "red", swatch: "#ef4444" },
  { id: "green", swatch: "#22c55e" },
  { id: "orange", swatch: "#f97316" },
  { id: "purple", swatch: "#a855f7" },
  { id: "yellow", swatch: "#eab308" },
  { id: "pink", swatch: "#ec4899" },
  { id: "teal", swatch: "#14b8a6" },
  { id: "lavender", swatch: "#c4b5fd" },
  { id: "coral", swatch: "#fb7185" },
] as const;

const SHAPE_OPTIONS: HumanShape[] = ["circle", "square", "triangle", "star", "heart", "diamond"];

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickMany<T>(items: readonly T[], count: number): T[] {
  return shuffle([...items]).slice(0, count);
}

function nonce() {
  return Math.random().toString(36).slice(2, 8);
}

export function createHumanChallenge(): HumanChallenge {
  const type: HumanChallengeType = Math.random() < 0.62 ? "color" : "shape";

  if (type === "color") {
    const target = COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length)];
    const decoys = pickMany(
      COLOR_SWATCHES.filter((item) => item.id !== target.id),
      4
    );
    const options = shuffle([target, ...decoys]).map((item) => ({
      id: item.id,
      swatch: item.swatch,
    }));

    return {
      questionId: `color:${target.id}:${nonce()}`,
      type,
      answer: target.id,
      targetKey: target.id,
      options,
    };
  }

  const target = SHAPE_OPTIONS[Math.floor(Math.random() * SHAPE_OPTIONS.length)];
  const decoys = pickMany(
    SHAPE_OPTIONS.filter((item) => item !== target),
    4
  );
  const options = shuffle([target, ...decoys]).map((shape) => ({ id: shape, shape }));

  return {
    questionId: `shape:${target}:${nonce()}`,
    type,
    answer: target,
    targetKey: target,
    options,
  };
}

export function isHumanAnswer(questionId: string, answer: string) {
  const [, expected] = questionId.split(":");
  return Boolean(expected && answer && expected === answer);
}

/** @deprecated Use createHumanChallenge — kept for any stale imports */
export const HUMAN_QUESTIONS = [] as const;

export function getHumanQuestion(_id: string) {
  return undefined;
}
