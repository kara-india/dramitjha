// src/components/Feedback/FeedbackWidget.tsx
"use client";

import { useState } from "react";
import { MessageSquare, X, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, rating }),
      });
      trackEvent("feedback_submitted", { rating, feedbackLength: feedback.length });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setFeedback("");
      }, 2000);
    } catch (err) {
      console.error("Feedback submit error:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => { setIsOpen(true); trackEvent("feedback_widget_opened"); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#d5f14c] text-[#102321] font-bold text-xs shadow-2xl hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Give patient feedback"
        >
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </button>
      ) : (
        <div className="w-80 bg-[#102321] border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white font-heading">Patient Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close feedback widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="h-10 w-10 bg-teal-500/20 text-[#d5f14c] rounded-full flex items-center justify-center mx-auto border border-teal-500/40">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-white">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  How would you rate your experience?
                </label>
                <div className="flex gap-1.5 justify-center py-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        rating === num
                          ? "bg-[#d5f14c] text-[#102321]"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {num}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Your suggestions or notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what we can improve..."
                  className="w-full rounded-xl bg-[#0c1a18] border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl py-2.5 text-xs font-bold bg-[#d5f14c] text-[#102321] hover:bg-[#c4df3b] transition-all"
              >
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
