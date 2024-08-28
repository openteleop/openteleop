import { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";
import Button, { ButtonProps } from "./Button";
import { cn } from "@shared/helpers/tailwind";
import Icon from "./Icon";

const FileUploadBoxContext = createContext<{
  onFileChange: (files: File[]) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}>({
  onFileChange: (_files: File[]) => {},
  inputRef: { current: null },
});

// FileUploadBox.Root component
const FileUploadBoxRoot = ({
  children,
  onFileChange,
  allowPaste = false,
  className,
}: {
  children: React.ReactNode;
  onFileChange: (files: File[]) => void;
  allowPaste?: boolean;
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    onFileChange(Array.from(e.dataTransfer.files));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onPaste = (e: any) => {
    const clipboardData = e.clipboardData;
    const items = clipboardData.items;

    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }
    onFileChange(files);
  };

  useEffect(() => {
    const handlePaste = (e: any) => {
      if (allowPaste) {
        onPaste(e);
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [allowPaste]);

  return (
    <FileUploadBoxContext.Provider value={{ onFileChange, inputRef }}>
      <input hidden multiple type="file" ref={inputRef} onChange={(e) => onFileChange(Array.from(e.target.files ?? []))} />
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-rx-2 rounded-3 border border-dashed border-gray-6",
          dragOver ? "ring ring-accent-6 ring-offset-1" : "",
          className,
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {children}
      </div>
    </FileUploadBoxContext.Provider>
  );
};

const FileUploadBoxBrowseButton = forwardRef<HTMLButtonElement, ButtonProps>(({ size, variant, children, ...props }, ref) => {
  const { inputRef } = useContext(FileUploadBoxContext);
  return (
    <Button ref={ref} size={size ?? "xs"} variant={variant ?? "outline"} onClick={() => inputRef.current?.click()} {...props}>
      {children ?? "Browse"}
    </Button>
  );
});

const FileUploadBoxResetButton = forwardRef<HTMLButtonElement, ButtonProps>(({ size, variant, className, ...props }, ref) => {
  const { onFileChange } = useContext(FileUploadBoxContext);
  return (
    <Button
      ref={ref}
      size={size ?? "xs"}
      variant={variant ?? "ghost"}
      className={cn("absolute right-1 top-1 h-rx-5 w-rx-5", className)}
      onClick={() => onFileChange([])}
      {...props}
    >
      <Icon icon="times" />
    </Button>
  );
});

const FileUploadBox = Object.assign(FileUploadBoxRoot, {
  Root: FileUploadBoxRoot,
  BrowseButton: FileUploadBoxBrowseButton,
  ResetButton: FileUploadBoxResetButton,
});

export default FileUploadBox;
