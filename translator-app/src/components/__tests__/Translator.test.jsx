import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../../App";
import * as api from "../../api/translate";

// Mock the translate API service
vi.mock("../../api/translate", () => ({
  translateText: vi.fn(),
}));

describe("Translator Application", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders input and placeholder output correctly", () => {
    render(<App />);
    
    expect(screen.getByLabelText("Source Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Target Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Source text to translate")).toBeInTheDocument();
    expect(screen.getByText(/Your translation will appear here.../i)).toBeInTheDocument();
  });

  it("calls translate API with debounce when user types text", async () => {
    api.translateText.mockResolvedValue("नमस्ते दुनिया");
    render(<App />);

    const textarea = screen.getByLabelText("Source text to translate");
    
    // Simulate user typing
    fireEvent.change(textarea, { target: { value: "Hello World" } });

    // Instantly check that API is not called yet (debounce is active)
    expect(api.translateText).not.toHaveBeenCalled();

    // Fast-forward timers by 500ms
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flush pending promise microtasks inside the timer
    await act(async () => {
      await Promise.resolve();
    });

    // Verify params
    expect(api.translateText).toHaveBeenCalledWith("Hello World", "en", "hi", expect.any(AbortSignal));
    
    const output = screen.getByTestId("translated-output");
    expect(output).toHaveTextContent("नमस्ते दुनिया");
  });

  it("shows error message if translation fails", async () => {
    api.translateText.mockRejectedValue(new Error("Network error. Please verify your internet connection."));
    render(<App />);

    const textarea = screen.getByLabelText("Source text to translate");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flush pending promise microtasks inside the timer
    await act(async () => {
      await Promise.resolve();
    });

    const errorMsg = screen.getByText(/Network error. Please verify your internet connection./i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("clears output and errors when user empties the input text", async () => {
    render(<App />);

    const textarea = screen.getByLabelText("Source text to translate");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flush pending promise microtasks
    await act(async () => {
      await Promise.resolve();
    });

    // Clear input
    fireEvent.change(textarea, { target: { value: "" } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flush pending promise microtasks
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText(/Your translation will appear here.../i)).toBeInTheDocument();
  });
});
