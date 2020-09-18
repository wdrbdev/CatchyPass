import React from "react";
import { render, screen } from "@testing-library/react"; // fireEvent, waitFor, within,
import App from "./App";
import Header from "./components/Header";
import About from "./components/About";
import Tutorial from "./components/Tutorial";

// Solve ReferenceError: MutationObserver is not defined
import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

describe("When render Header,", () => {
  test("Navbar shows href of tutorial and about page", async () => {
    render(<Header />);
    expect(screen.getByText("Tutorial")).toHaveAttribute("href", "/tutorial");
    expect(screen.getByText("About")).toHaveAttribute("href", "/about");
  });

  test("Navbar shows project name", async () => {
    const { container } = render(<App />);
    expect(container.querySelector("#project-name")).toHaveTextContent(
      "CatchyPass"
    );
  });
});

test("Test rendering about page", async () => {
  const { container } = render(<About />);
  expect(container.getElementsByClassName("title")[0]).toHaveTextContent(
    "CatchyPass - About"
  );
});

test("Test rendering tutorial page", async () => {
  const { container } = render(<Tutorial />);
  expect(container.getElementsByClassName("title")[0]).toHaveTextContent(
    "CatchyPass - Tutorial"
  );
});
