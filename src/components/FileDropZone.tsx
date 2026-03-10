import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  onFileContent: (content: string, fileName: string) => void;
  onFileBytes?: (bytes: Uint8Array, fileName: string) => void;
  accept?: string;
  binary?: boolean;
  label?: string;
}

export function FileDropZone({ onFileContent, onFileBytes, accept, binary, label = "Drop a file or click to select" }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (binary && onFileBytes) {
      file.arrayBuffer().then((buf) => onFileBytes(new Uint8Array(buf), file.name));
    } else {
      const reader = new FileReader();
      reader.onload = () => onFileContent(reader.result as string, file.name);
      reader.readAsText(file);
    }
  }, [onFileContent, onFileBytes, binary]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        dragging
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
      }`}
    >
      <Upload size={16} className="mx-auto mb-1.5" />
      <p className="text-xs font-medium">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
