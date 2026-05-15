import { render, screen, fireEvent } from "@testing-library/react";
import OptionCard from "./OptionCard";

test("renders option text", () => {
  render(<OptionCard text="Senior (5+ yrs)" selected={false} onSelect={() => {}} />);
  expect(screen.getByText("Senior (5+ yrs)")).toBeInTheDocument();
});

test("shows selected state when selected=true", () => {
  render(<OptionCard text="Senior (5+ yrs)" selected={true} onSelect={() => {}} />);
  const card = screen.getByRole("button");
  expect(card).toHaveClass("border-aareon-bright");
});

test("calls onSelect when clicked", () => {
  const onSelect = jest.fn();
  render(<OptionCard text="Senior (5+ yrs)" selected={false} onSelect={onSelect} />);
  fireEvent.click(screen.getByRole("button"));
  expect(onSelect).toHaveBeenCalledTimes(1);
});
