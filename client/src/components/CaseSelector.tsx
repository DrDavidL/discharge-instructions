import { useState, type ChangeEvent } from "react";
import type { CaseSummary } from "@dci/shared";

export interface SelectedCase {
  id: string;
  title: string;
  content: string;
  isUploaded: boolean;
}

interface Props {
  cases: CaseSummary[];
  onSelect: (s: SelectedCase) => void;
}

export function CaseSelector({ cases, onSelect }: Props) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [ack, setAck] = useState(false);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  return (
    <section>
      <div className="section-intro">
        <h2>Step 1 · Choose a case</h2>
        <p>Pick a simulated discharge summary to work from, or upload your own simulated document.</p>
      </div>

      <div className="case-grid">
        {cases.map((c) => (
          <article key={c.id} className="case-card">
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
            <button
              className="btn btn-primary"
              onClick={() => onSelect({ id: c.id, title: c.title, content: c.content, isUploaded: false })}
            >
              Use this case
            </button>
          </article>
        ))}

        <article className={`case-card case-card-upload ${uploadOpen ? "open" : ""}`}>
          <h3>Upload your own</h3>
          <p>
            Paste or upload a <strong>simulated</strong> discharge summary (.txt or .md).
          </p>
          {!uploadOpen ? (
            <button className="btn btn-secondary" onClick={() => setUploadOpen(true)}>
              Upload / paste
            </button>
          ) : (
            <div className="upload-body">
              <div className="alert alert-warning">
                ⚠️ Use <strong>only simulated content</strong>. Do not paste or upload any real
                patient information (PHI).
              </div>
              <input
                type="file"
                accept=".txt,.md,.markdown,text/plain,text/markdown"
                onChange={onFile}
              />
              <textarea
                placeholder="…or paste the simulated discharge summary here"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
              />
              <label className="checkbox">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                <span>I confirm this document contains no real patient information.</span>
              </label>
              <button
                className="btn btn-primary"
                disabled={!text.trim() || !ack}
                onClick={() =>
                  onSelect({
                    id: "uploaded",
                    title: name || "Uploaded case",
                    content: text,
                    isUploaded: true,
                  })
                }
              >
                Use this document
              </button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
