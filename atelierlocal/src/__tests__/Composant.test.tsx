import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("Question à l'organisateur", () => {
  it("depuis App, conserve le sujet et la question après un envoi sans email, puis confirme le bon atelier et le bon sujet après correction", async () => {
    const user = userEvent.setup();
    render(<App />);

    const cards = screen.getAllByRole("article");
    const ceramiqueCard = cards.find(card =>
      within(card).queryByText("Une tasse en céramique") !== null,
    )!;
    await user.click(within(ceramiqueCard).getByRole("button", { name: /poser une question/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Une tasse en céramique")).toBeInTheDocument();

    const select = within(dialog).getByRole("combobox", { name: /sujet/i });
    await user.selectOptions(select, "materiel");
    expect(select).toHaveValue("materiel");

    const textarea = within(dialog).getByRole("textbox", { name: /votre question/i });
    await user.type(textarea, "Doit-on apporter un tablier ?");

    await user.click(within(dialog).getByRole("button", { name: /envoyer/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(within(dialog).getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText(/bien été transmise/i)).not.toBeInTheDocument();
    expect(select).toHaveValue("materiel");
    expect(textarea).toHaveValue("Doit-on apporter un tablier ?");

    const emailInput = within(dialog).getByRole("textbox", { name: /adresse électronique/i });
    await user.type(emailInput, "alice@exemple.fr");
    await user.click(within(dialog).getByRole("button", { name: /envoyer/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const confirmations = screen.getAllByRole("status");
    const confirmation = confirmations.find(el => el.textContent?.includes("bien été transmise"))!;
    expect(confirmation).toHaveTextContent("Une tasse en céramique");
    expect(confirmation).toHaveTextContent("Le matériel à apporter");
  });
});
