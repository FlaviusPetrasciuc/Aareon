import { render, screen, fireEvent } from "@testing-library/react";
import JDPreviewPanel from "./JDPreviewPanel";

test("shows generating state when jdContent is empty", () => {
  render(
    <JDPreviewPanel
      jdContent=""
      hiringKit=""
      answeredCount={2}
      totalQuestions={8}
      onExportMarkdown={() => {}}
      onExportPlainText={() => {}}
    />
  );
  expect(screen.getByText(/Generating/)).toBeInTheDocument();
});

test("shows JD content when provided", () => {
  render(
    <JDPreviewPanel
      jdContent="## Staff Engineer\n\nWe are hiring..."
      hiringKit=""
      answeredCount={8}
      totalQuestions={8}
      onExportMarkdown={() => {}}
      onExportPlainText={() => {}}
    />
  );
  expect(screen.getByText(/Staff Engineer/)).toBeInTheDocument();
});

test("export buttons disabled when jdContent is empty", () => {
  render(
    <JDPreviewPanel
      jdContent=""
      hiringKit=""
      answeredCount={0}
      totalQuestions={8}
      onExportMarkdown={() => {}}
      onExportPlainText={() => {}}
    />
  );
  expect(screen.getByText("Export Markdown")).toBeDisabled();
  expect(screen.getByText("Export Plain Text")).toBeDisabled();
});

test("export buttons enabled when jdContent is present", () => {
  render(
    <JDPreviewPanel
      jdContent="## Staff Engineer"
      hiringKit=""
      answeredCount={8}
      totalQuestions={8}
      onExportMarkdown={() => {}}
      onExportPlainText={() => {}}
    />
  );
  expect(screen.getByText("Export Markdown")).not.toBeDisabled();
});

test("calls onExportMarkdown when Export Markdown clicked", () => {
  const onExportMarkdown = jest.fn();
  render(
    <JDPreviewPanel
      jdContent="## Staff Engineer"
      hiringKit=""
      answeredCount={8}
      totalQuestions={8}
      onExportMarkdown={onExportMarkdown}
      onExportPlainText={() => {}}
    />
  );
  fireEvent.click(screen.getByText("Export Markdown"));
  expect(onExportMarkdown).toHaveBeenCalledTimes(1);
});
