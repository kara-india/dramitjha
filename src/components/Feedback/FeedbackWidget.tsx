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
          className="flex items-center gap-2 px-4 py-2.5 rounded-full gold-gradient-btn font-bold text-xs shadow-2xl hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a]"
          aria-label="Give patient feedback"
        >
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </button>
      ) : (
        <div className="w-80 bg-white border border-[#c89b2a]/40 rounded-2xl p-5 shadow-2xl text-stone-800">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
            <h3 className="text-sm font-bold text-stone-900 font-heading">Patient Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-900 p-1"
              aria-label="Close feedback widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="h-10 w-10 bg-[#f5e8c7] text-[#c89b2a] rounded-full flex items-center justify-center mx-auto border border-[#c89b2a]/40">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-stone-900">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-600 mb-1">
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
                          ? "gold-gradient-btn"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {num}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-stone-600 mb-1">
                  Your suggestions or notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what we can improve..."
                  className="w-full rounded-xl bg-[#fcfbf8] border border-[#c89b2a]/40 p-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c89b2a]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl py-2.5 text-xs font-bold gold-gradient-btn"
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
