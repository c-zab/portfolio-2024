/**
 * Types a heading's text letter by letter behind a caret that behaves like a real
 * text cursor: solid while typing, blinking when idle.
 *
 * Markup: an element with `.typed` and a `.typed__text` child holding the text.
 * Styles live in tokens.css.
 */

export type Typewriter = {
  /** Resolves when the text is fully typed (or shown at once). */
  done: Promise<void>;
  /** Skip to the end: show everything and leave the caret blinking. */
  finish(): void;
  /** Backspace the current text and type a new one (used on language switch). */
  retype(text: string): void;
};

type Options = {
  /** How long the caret blinks before the first key, in ms. */
  startDelay?: number;
};

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Delay before typing a character, based on the one just typed. Uneven on purpose. */
function keyDelay(previous: string | undefined) {
  // Two random terms cluster around ~70ms instead of spreading evenly.
  let ms = 32 + Math.random() * 42 + Math.random() * 32;
  if (previous === " ") ms += 25 + Math.random() * 45;
  if (previous && /[,.;:!?]/.test(previous)) ms += 170 + Math.random() * 150;
  if (Math.random() < 0.06) ms += 110 + Math.random() * 150;
  return ms;
}

function splitText(container: HTMLElement, text: string) {
  container.textContent = "";
  const chars: HTMLElement[] = [];

  text.split(/(\s+)/).forEach((token) => {
    if (!token) return;
    if (/^\s+$/.test(token)) {
      const space = document.createElement("span");
      space.className = "typed__char";
      space.textContent = " ";
      container.append(space);
      chars.push(space);
      return;
    }
    // Words stay on one line; only the spaces between them can wrap.
    const word = document.createElement("span");
    word.className = "typed__word";
    for (const letter of token) {
      const char = document.createElement("span");
      char.className = "typed__char";
      char.textContent = letter;
      word.append(char);
      chars.push(char);
    }
    container.append(word);
  });

  return chars;
}

export function createTypewriter(root: HTMLElement, { startDelay = 600 }: Options = {}): Typewriter {
  const textEl = root.querySelector<HTMLElement>(".typed__text") ?? root;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    root.classList.add("is-split", "is-static");
    return {
      done: Promise.resolve(),
      finish() {},
      retype(text) {
        textEl.textContent = text;
      },
    };
  }

  const caret = document.createElement("span");
  caret.className = "typed__caret";
  caret.setAttribute("aria-hidden", "true");
  root.append(caret);

  let chars = splitText(textEl, textEl.textContent?.trim() ?? "");
  let typed = 0;
  // Bumped whenever a run is interrupted, so stale loops stop on their next await.
  let run = 0;
  let resolveDone: () => void = () => {};
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  root.classList.add("is-split");

  const placeCaret = () => {
    const anchor = typed > 0 ? chars[typed - 1] : chars[0];
    if (!anchor) return;
    const rootRect = root.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(root).fontSize) || 16;
    const gap = fontSize * 0.05;
    const x = (typed > 0 ? rect.right + gap : rect.left - gap) - rootRect.left;
    const height = rect.height * 0.82;
    const y = rect.top - rootRect.top + (rect.height - height) / 2;
    caret.style.height = `${height}px`;
    caret.style.transform = `translate(${x}px, ${y}px)`;
  };

  const setTyped = (count: number) => {
    chars.forEach((char, index) => char.classList.toggle("is-typed", index < count));
    typed = count;
    placeCaret();
  };

  const settle = () => {
    root.classList.remove("is-typing");
    setTyped(chars.length);
    resolveDone();
  };

  const type = async (id: number) => {
    root.classList.add("is-typing");
    for (let i = typed; i < chars.length; i += 1) {
      await sleep(keyDelay(chars[i - 1]?.textContent ?? undefined));
      if (id !== run) return;
      setTyped(i + 1);
    }
    settle();
  };

  const start = async () => {
    const id = ++run;
    setTyped(0);
    // A hidden tab throttles timers, so typing would crawl; just show the text.
    if (document.hidden) {
      settle();
      return;
    }
    await sleep(startDelay);
    if (id !== run) return;
    await type(id);
  };

  new ResizeObserver(placeCaret).observe(root);
  start();

  return {
    done,
    finish() {
      run += 1;
      settle();
    },
    retype(text) {
      const id = ++run;
      (async () => {
        root.classList.add("is-typing");
        for (let i = typed; i > 0; i -= 1) {
          // Held backspace: quick and steady.
          await sleep(14 + Math.random() * 10);
          if (id !== run) return;
          setTyped(i - 1);
        }
        // Brief idle blink before the new words, like someone deciding what to write.
        root.classList.remove("is-typing");
        chars = splitText(textEl, text);
        setTyped(0);
        await sleep(380);
        if (id !== run) return;
        await type(id);
      })();
    },
  };
}
