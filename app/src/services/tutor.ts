import { apiPost, apiGet } from "./api";

// ─── Types ────────────────────────────────────────────

export interface StudySession {
  id: string;
  topic: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface TutorThread {
  id: string;
  sessionId: string;
  title: string | null;
  createdAt: string;
  _count?: { messages: number };
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

// ─── API Calls ────────────────────────────────────────

export async function createStudySession(
  topic?: string,
): Promise<StudySession> {
  const res = await apiPost<{ data: StudySession }>("/api/v1/study-sessions", {
    topic,
  });
  return res.data;
}

export async function createThread(
  sessionId: string,
  title?: string,
): Promise<TutorThread> {
  const res = await apiPost<{ data: TutorThread }>("/api/v1/tutor/threads", {
    sessionId,
    title,
  });
  return res.data;
}

export async function listThreads(): Promise<TutorThread[]> {
  const res = await apiGet<{ data: TutorThread[] }>("/api/v1/tutor/threads");
  return res.data;
}

export async function getMessages(threadId: string): Promise<Message[]> {
  const res = await apiGet<{ data: Message[] }>(
    `/api/v1/tutor/threads/${threadId}/messages`,
  );
  return res.data;
}

export async function postMessage(
  threadId: string,
  content: string,
): Promise<Message> {
  const res = await apiPost<{ data: Message }>(
    `/api/v1/tutor/threads/${threadId}/messages`,
    { content },
  );
  return res.data;
}

// ─── SSE Streaming via fetch() ────────────────────────

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (messageId: string) => void;
  onError: (error: string) => void;
}

/**
 * Stream assistant response using fetch() with ReadableStream.
 * This works with cookies (credentials: 'include') unlike EventSource.
 * Returns an AbortController so the caller can cancel the stream.
 */
export function streamAssistant(
  threadId: string,
  afterMessageId: string | undefined,
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController();

  let path = `/api/v1/tutor/threads/${threadId}/stream`;
  if (afterMessageId) {
    path += `?afterMessageId=${afterMessageId}`;
  }

  (async () => {
    try {
      const res = await fetch(path, {
        credentials: "include",
        signal: controller.signal,
      });

      if (!res.ok) {
        callbacks.onError(`HTTP ${res.status}`);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        callbacks.onError("No response body");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep incomplete line in buffer

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (eventType === "token") {
                callbacks.onToken(parsed);
              } else if (eventType === "done") {
                callbacks.onDone(parsed.messageId);
              } else if (eventType === "error") {
                callbacks.onError(parsed.message);
              }
            } catch {
              // Ignore malformed JSON
            }
            eventType = "";
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        callbacks.onError(err.message);
      }
    }
  })();

  return controller;
}
