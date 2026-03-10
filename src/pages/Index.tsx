import { useState, useEffect } from "react";
import { ToolSidebar, tools, type ToolId } from "../components/ToolSidebar";
import { CommandPalette } from "../components/CommandPalette";
import { JsonFormatter } from "../components/JsonFormatter";
import { RegexTester } from "../components/RegexTester";
import { UuidGenerator } from "../components/UuidGenerator";
import { Base64Tool } from "../components/Base64Tool";
import { ColorConverter } from "../components/ColorConverter";
import { FakerTool } from "../components/FakerTool";
import { DataMasker } from "../components/DataMasker";
import { CsvJsonTool } from "../components/CsvJsonTool";
import { HashTool } from "../components/HashTool";
import { DiffTool } from "../components/DiffTool";
import { EnvEditor } from "../components/EnvEditor";
import { JwtDecoder } from "../components/JwtDecoder";
import { TimestampTool } from "../components/TimestampTool";
import { UrlTool } from "../components/UrlTool";
import { PasswordGenerator } from "../components/PasswordGenerator";
import { LoremGenerator } from "../components/LoremGenerator";
import { CronParser } from "../components/CronParser";
import { TextCounter } from "../components/TextCounter";
import { CaseConverter } from "../components/CaseConverter";
import { PngMaker } from "../components/PngMaker";
import { QrCodeTool } from "../components/QrCodeTool";
import { GradientTool } from "../components/GradientTool";
import { SvgIconEditor } from "../components/SvgIconEditor";
import { MarkdownPreview } from "../components/MarkdownPreview";
import { JsonToTsTool } from "../components/JsonToTsTool";
import { ChmodCalc } from "../components/ChmodCalc";
import { HtmlEntityTool } from "../components/HtmlEntityTool";
import { SlugifyTool } from "../components/SlugifyTool";
import { BaseConverter } from "../components/BaseConverter";
import { SqlFormatter } from "../components/SqlFormatter";
import { BoxShadowTool } from "../components/BoxShadowTool";
import { CssUnitTool } from "../components/CssUnitTool";
import { PaletteTool } from "../components/PaletteTool";
import { AspectRatioTool } from "../components/AspectRatioTool";
import { RegexLibrary } from "../components/RegexLibrary";
import { CipherTool } from "../components/CipherTool";
import { AesEncryptTool } from "../components/AesEncryptTool";
import { FreqAnalysisTool } from "../components/FreqAnalysisTool";
import { AlphabetMapper } from "../components/AlphabetMapper";
import { PlayfairTool } from "../components/PlayfairTool";
import { TextEncoderTool } from "../components/TextEncoderTool";
import { AdvancedCipherTool } from "../components/AdvancedCipherTool";
import { KeyGenTool } from "../components/KeyGenTool";
import { StringEscapeTool } from "../components/StringEscapeTool";
import { NumberFormatTool } from "../components/NumberFormatTool";
import { IpSubnetTool } from "../components/IpSubnetTool";
import { ContrastCheckerTool } from "../components/ContrastCheckerTool";
import { EmojiPickerTool } from "../components/EmojiPickerTool";
import { HttpStatusTool } from "../components/HttpStatusTool";
import { UnitConverterTool } from "../components/UnitConverterTool";
import { FontPreviewTool } from "../components/FontPreviewTool";
import { Menu, Search, Sun, Moon } from "lucide-react";

const toolComponents: Record<ToolId, React.FC> = {
  json: JsonFormatter,
  regex: RegexTester,
  uuid: UuidGenerator,
  base64: Base64Tool,
  color: ColorConverter,
  faker: FakerTool,
  masker: DataMasker,
  csv: CsvJsonTool,
  hash: HashTool,
  diff: DiffTool,
  env: EnvEditor,
  jwt: JwtDecoder,
  timestamp: TimestampTool,
  url: UrlTool,
  password: PasswordGenerator,
  lorem: LoremGenerator,
  cron: CronParser,
  textcount: TextCounter,
  caseconv: CaseConverter,
  png: PngMaker,
  qrcode: QrCodeTool,
  gradient: GradientTool,
  svgicon: SvgIconEditor,
  markdown: MarkdownPreview,
  json2ts: JsonToTsTool,
  chmod: ChmodCalc,
  htmlentity: HtmlEntityTool,
  slugify: SlugifyTool,
  baseconv: BaseConverter,
  sql: SqlFormatter,
  boxshadow: BoxShadowTool,
  cssunit: CssUnitTool,
  palette: PaletteTool,
  aspectratio: AspectRatioTool,
  regexlib: RegexLibrary,
  cipher: CipherTool,
  aes: AesEncryptTool,
  freqanalysis: FreqAnalysisTool,
  alphabetmap: AlphabetMapper,
  playfair: PlayfairTool,
  textencoder: TextEncoderTool,
  advcipher: AdvancedCipherTool,
  keygen: KeyGenTool,
  strescape: StringEscapeTool,
  numformat: NumberFormatTool,
  ipsubnet: IpSubnetTool,
  contrast: ContrastCheckerTool,
  emoji: EmojiPickerTool,
  httpstatus: HttpStatusTool,
  unitconv: UnitConverterTool,
  fontpreview: FontPreviewTool,
};

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("utilyx:theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("utilyx:theme", theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

const Index = () => {
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    const stored = localStorage.getItem("utilyx:activeTool");
    return (stored as ToolId) || "faker";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const ActiveComponent = toolComponents[activeTool];
  const activeDef = tools.find((t) => t.id === activeTool)!;

  const handleSelectTool = (id: ToolId) => {
    setActiveTool(id);
    setSidebarOpen(false);
    localStorage.setItem("utilyx:activeTool", id);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CommandPalette onSelect={handleSelectTool} />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <ToolSidebar activeTool={activeTool} onSelect={handleSelectTool} />
      </div>
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              {activeDef.icon}
              <span className="truncate">{activeDef.label}</span>
            </h1>
            <p className="text-xs text-muted-foreground truncate">{activeDef.description}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => {
              const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
              document.dispatchEvent(evt);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <Search size={13} />
            <span>Search</span>
            <kbd className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
          </button>
        </header>
        <div className="p-3 sm:p-6 max-w-4xl">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Index;
