import { useState, useMemo } from "react";
import { useCopyToClipboard } from "./ToolSidebar";

interface EmojiEntry { emoji: string; name: string; category: string; }

const EMOJIS: EmojiEntry[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", category: "Smileys" }, { emoji: "😃", name: "grinning face big eyes", category: "Smileys" },
  { emoji: "😄", name: "grinning squinting", category: "Smileys" }, { emoji: "😁", name: "beaming face", category: "Smileys" },
  { emoji: "😆", name: "squinting face", category: "Smileys" }, { emoji: "😅", name: "sweat grinning", category: "Smileys" },
  { emoji: "🤣", name: "rolling laughing", category: "Smileys" }, { emoji: "😂", name: "joy tears", category: "Smileys" },
  { emoji: "🙂", name: "slightly smiling", category: "Smileys" }, { emoji: "😉", name: "winking", category: "Smileys" },
  { emoji: "😊", name: "smiling blush", category: "Smileys" }, { emoji: "😇", name: "smiling halo", category: "Smileys" },
  { emoji: "😍", name: "heart eyes", category: "Smileys" }, { emoji: "🤩", name: "star struck", category: "Smileys" },
  { emoji: "😘", name: "kissing heart", category: "Smileys" }, { emoji: "😜", name: "winking tongue", category: "Smileys" },
  { emoji: "🤔", name: "thinking face", category: "Smileys" }, { emoji: "🤨", name: "raised eyebrow", category: "Smileys" },
  { emoji: "😐", name: "neutral face", category: "Smileys" }, { emoji: "😑", name: "expressionless", category: "Smileys" },
  { emoji: "😶", name: "no mouth", category: "Smileys" }, { emoji: "🙄", name: "rolling eyes", category: "Smileys" },
  { emoji: "😏", name: "smirking", category: "Smileys" }, { emoji: "😣", name: "persevering", category: "Smileys" },
  { emoji: "😢", name: "crying face", category: "Smileys" }, { emoji: "😭", name: "loudly crying", category: "Smileys" },
  { emoji: "😤", name: "huffing", category: "Smileys" }, { emoji: "😠", name: "angry face", category: "Smileys" },
  { emoji: "🤯", name: "exploding head", category: "Smileys" }, { emoji: "😱", name: "screaming fear", category: "Smileys" },
  { emoji: "🥺", name: "pleading face", category: "Smileys" }, { emoji: "😴", name: "sleeping face", category: "Smileys" },
  { emoji: "🤮", name: "vomiting", category: "Smileys" }, { emoji: "🤡", name: "clown face", category: "Smileys" },
  { emoji: "💀", name: "skull", category: "Smileys" }, { emoji: "👻", name: "ghost", category: "Smileys" },
  // Hands & People
  { emoji: "👍", name: "thumbs up", category: "Hands" }, { emoji: "👎", name: "thumbs down", category: "Hands" },
  { emoji: "👋", name: "waving hand", category: "Hands" }, { emoji: "🤝", name: "handshake", category: "Hands" },
  { emoji: "✌️", name: "peace sign", category: "Hands" }, { emoji: "🤞", name: "crossed fingers", category: "Hands" },
  { emoji: "👏", name: "clapping hands", category: "Hands" }, { emoji: "🙌", name: "raising hands", category: "Hands" },
  { emoji: "💪", name: "flexed bicep", category: "Hands" }, { emoji: "🫡", name: "saluting face", category: "Hands" },
  { emoji: "🤌", name: "pinched fingers", category: "Hands" }, { emoji: "☝️", name: "index pointing up", category: "Hands" },
  { emoji: "👆", name: "pointing up", category: "Hands" }, { emoji: "👇", name: "pointing down", category: "Hands" },
  { emoji: "👈", name: "pointing left", category: "Hands" }, { emoji: "👉", name: "pointing right", category: "Hands" },
  // Hearts & Symbols
  { emoji: "❤️", name: "red heart", category: "Symbols" }, { emoji: "💛", name: "yellow heart", category: "Symbols" },
  { emoji: "💚", name: "green heart", category: "Symbols" }, { emoji: "💙", name: "blue heart", category: "Symbols" },
  { emoji: "💜", name: "purple heart", category: "Symbols" }, { emoji: "🖤", name: "black heart", category: "Symbols" },
  { emoji: "🤍", name: "white heart", category: "Symbols" }, { emoji: "💔", name: "broken heart", category: "Symbols" },
  { emoji: "🔥", name: "fire", category: "Symbols" }, { emoji: "⭐", name: "star", category: "Symbols" },
  { emoji: "✨", name: "sparkles", category: "Symbols" }, { emoji: "💫", name: "dizzy star", category: "Symbols" },
  { emoji: "🎉", name: "party popper", category: "Symbols" }, { emoji: "🎊", name: "confetti ball", category: "Symbols" },
  { emoji: "💯", name: "hundred points", category: "Symbols" }, { emoji: "⚡", name: "lightning bolt", category: "Symbols" },
  { emoji: "💥", name: "collision boom", category: "Symbols" }, { emoji: "🏆", name: "trophy", category: "Symbols" },
  { emoji: "✅", name: "check mark", category: "Symbols" }, { emoji: "❌", name: "cross mark", category: "Symbols" },
  { emoji: "⚠️", name: "warning sign", category: "Symbols" }, { emoji: "🚫", name: "prohibited", category: "Symbols" },
  // Objects & Tech
  { emoji: "💻", name: "laptop", category: "Tech" }, { emoji: "📱", name: "mobile phone", category: "Tech" },
  { emoji: "⌨️", name: "keyboard", category: "Tech" }, { emoji: "🖥️", name: "desktop computer", category: "Tech" },
  { emoji: "🔒", name: "locked padlock", category: "Tech" }, { emoji: "🔑", name: "key", category: "Tech" },
  { emoji: "🔗", name: "link chain", category: "Tech" }, { emoji: "📧", name: "email envelope", category: "Tech" },
  { emoji: "📂", name: "open folder", category: "Tech" }, { emoji: "📁", name: "file folder", category: "Tech" },
  { emoji: "🗑️", name: "trash wastebasket", category: "Tech" }, { emoji: "📊", name: "bar chart", category: "Tech" },
  { emoji: "⚙️", name: "gear settings", category: "Tech" }, { emoji: "🔧", name: "wrench tool", category: "Tech" },
  { emoji: "🛠️", name: "hammer wrench", category: "Tech" }, { emoji: "🐛", name: "bug", category: "Tech" },
  { emoji: "🚀", name: "rocket launch", category: "Tech" }, { emoji: "📦", name: "package box", category: "Tech" },
  // Nature
  { emoji: "🌍", name: "globe earth", category: "Nature" }, { emoji: "☀️", name: "sun", category: "Nature" },
  { emoji: "🌙", name: "crescent moon", category: "Nature" }, { emoji: "🌈", name: "rainbow", category: "Nature" },
  { emoji: "🌊", name: "water wave", category: "Nature" }, { emoji: "🌸", name: "cherry blossom", category: "Nature" },
  { emoji: "🌻", name: "sunflower", category: "Nature" }, { emoji: "🍀", name: "four leaf clover", category: "Nature" },
  { emoji: "🐶", name: "dog face", category: "Nature" }, { emoji: "🐱", name: "cat face", category: "Nature" },
  { emoji: "🦊", name: "fox", category: "Nature" }, { emoji: "🐻", name: "bear", category: "Nature" },
  // Food
  { emoji: "☕", name: "coffee", category: "Food" }, { emoji: "🍕", name: "pizza", category: "Food" },
  { emoji: "🍔", name: "hamburger", category: "Food" }, { emoji: "🌮", name: "taco", category: "Food" },
  { emoji: "🍩", name: "doughnut", category: "Food" }, { emoji: "🎂", name: "birthday cake", category: "Food" },
  { emoji: "🍺", name: "beer mug", category: "Food" }, { emoji: "🥤", name: "cup with straw", category: "Food" },
];

const CATEGORIES = ["All", "Smileys", "Hands", "Symbols", "Tech", "Nature", "Food"];

export function EmojiPickerTool() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collected, setCollected] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const { CopyButton } = useCopyToClipboard();

  const filtered = useMemo(() => {
    return EMOJIS.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.emoji.includes(search)) return false;
      return true;
    });
  }, [search, category]);

  const addEmoji = (emoji: string) => {
    setCollected((c) => c + emoji);
    setRecentlyAdded(emoji);
    setTimeout(() => setRecentlyAdded(null), 300);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emojis…"
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block">Category</label>
        <div className="flex flex-wrap bg-secondary rounded-lg overflow-hidden">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${category === c ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{filtered.length} emojis</span>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3 grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1 max-h-[300px] overflow-y-auto"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))" }}>
          {filtered.map((e, i) => (
            <button key={i} onClick={() => addEmoji(e.emoji)} title={e.name}
              className="w-9 h-9 flex items-center justify-center text-lg rounded-md hover:bg-primary/10 transition-colors">
              {e.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Collected */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Collected {collected.length > 0 && `· ${[...collected].length} emojis`}
          </label>
          <div className="flex gap-1.5">
            {collected && (
              <button onClick={() => setCollected("")}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-secondary hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors">
                Clear
              </button>
            )}
            <CopyButton text={collected} />
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg px-4 py-3 min-h-[48px] text-xl leading-relaxed break-all">
          {collected || <span className="text-muted-foreground text-sm">Click emojis to collect them here</span>}
        </div>
      </div>

      {/* HTML entities */}
      {collected && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Code Points</label>
            <CopyButton text={[...collected].map((c) => `&#x${c.codePointAt(0)!.toString(16)};`).join("")} />
          </div>
          <pre className="bg-surface border border-border rounded-lg p-3 font-mono text-xs text-foreground overflow-auto whitespace-pre-wrap">
            {[...collected].map((c) => `&#x${c.codePointAt(0)!.toString(16)};`).join("")}
          </pre>
        </div>
      )}
    </div>
  );
}
