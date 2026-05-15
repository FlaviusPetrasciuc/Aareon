export function downloadAsFile(filename: string, text: string, type: string = "text/plain"): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}

export function exportJDAsMarkdown(title: string, jd: string): void {
  downloadAsFile(`${title.replace(/\s+/g, "_")}_JD.md`, jd);
}

export function exportJDAsText(title: string, jd: string): void {
  // Simple markdown to text conversion (removing #, *, etc)
  const plainText = jd
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1");

  downloadAsFile(`${title.replace(/\s+/g, "_")}_JD.txt`, plainText);
}
