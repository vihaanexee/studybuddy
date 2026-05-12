"use client";

import { create } from "zustand";
import type { StudySession, TutorThread, Message } from "@/services/tutor";
import * as tutorService from "@/services/tutor";

interface StudyState {
  // Current study session
  session: StudySession | null;
  thread: TutorThread | null;
  messages: Message[];
  threads: TutorThread[];

  // Streaming state
  streaming: boolean;
  streamedText: string;
  streamController: AbortController | null;

  // Actions
  startSession: (topic?: string) => Promise<void>;
  createThread: (title?: string) => Promise<void>;
  loadThreads: () => Promise<void>;
  selectThread: (thread: TutorThread) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  cancelStream: () => void;
  reset: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  session: null,
  thread: null,
  messages: [],
  threads: [],
  streaming: false,
  streamedText: "",
  streamController: null,

  startSession: async (topic) => {
    const session = await tutorService.createStudySession(topic);
    set({ session, thread: null, messages: [], threads: [] });
  },

  createThread: async (title) => {
    const { session } = get();
    if (!session) throw new Error("No active session");

    const thread = await tutorService.createThread(session.id, title);
    set((s) => ({
      thread,
      messages: [],
      threads: [thread, ...s.threads],
    }));
  },

  loadThreads: async () => {
    const threads = await tutorService.listThreads();
    set({ threads });
  },

  selectThread: async (thread) => {
    const messages = await tutorService.getMessages(thread.id);
    set({ thread, messages });
  },

  sendMessage: async (content) => {
    const { thread, streaming } = get();
    if (!thread || streaming) return;

    // Post user message
    const userMsg = await tutorService.postMessage(thread.id, content);
    set((s) => ({
      messages: [...s.messages, userMsg],
      streaming: true,
      streamedText: "",
    }));

    // Stream assistant response
    const controller = tutorService.streamAssistant(thread.id, userMsg.id, {
      onToken: (token) => {
        set((s) => ({ streamedText: s.streamedText + token }));
      },
      onDone: (messageId) => {
        const finalText = get().streamedText;
        set((s) => ({
          messages: [
            ...s.messages,
            {
              id: messageId,
              role: "assistant" as const,
              content: finalText,
              createdAt: new Date().toISOString(),
            },
          ],
          streaming: false,
          streamedText: "",
          streamController: null,
        }));
      },
      onError: (error) => {
        console.error("Stream error:", error);
        set({ streaming: false, streamedText: "", streamController: null });
      },
    });

    set({ streamController: controller });
  },

  cancelStream: () => {
    const { streamController } = get();
    streamController?.abort();
    set({ streaming: false, streamedText: "", streamController: null });
  },

  reset: () => {
    const { streamController } = get();
    streamController?.abort();
    set({
      session: null,
      thread: null,
      messages: [],
      threads: [],
      streaming: false,
      streamedText: "",
      streamController: null,
    });
  },
}));
