// class borrowed from Liam's great calendar project:
// https://github.com/liamcain/obsidian-calendar-plugin

import { App, Modal } from "obsidian";

interface IConfirmationDialogParams {
  cta: string;
  // eslint-disable-next-line
  onAccept: (dateStr: string, ...args: any[]) => Promise<void>;
  text: string;
  title: string;
  fileDate: string;
}

export class ConfirmationModal extends Modal {
  constructor(app: App, config: IConfirmationDialogParams) {
    super(app);

    const { cta, onAccept, text, title, fileDate } = config;

    this.contentEl.createEl("h2", { text: title });

    // have to store the date somewhere since the eventing system was not passing in context on mobile.
    let e: HTMLParagraphElement = this.contentEl.createEl("p", { text });
    e.id = 'jumptodate-confirmdialog';
    e.setAttr('fileDate', fileDate)

    this.contentEl.createDiv("modal-button-container", (buttonsEl) => {
      buttonsEl
        .createEl("button", { text: "Never mind" })
        .addEventListener("click", () => this.close());

      const btnSumbit = buttonsEl
        .createEl("button", {
          attr: { type: 'submit' },
          cls: "mod-cta",
          text: cta,
        })
      btnSumbit.addEventListener("click", async (e) => {
        let dateStr: string = document.getElementById('jumptodate-confirmdialog').getAttr('filedate').toString();
        await onAccept(dateStr, e);
        this.close();
      })
      setTimeout(() => {
        btnSumbit.focus();
      }, 50);
    });
  }
}

export function createConfirmationDialog({
  cta,
  onAccept,
  text,
  title,
  fileDate
}: IConfirmationDialogParams): void {
  // @ts-ignore
  new ConfirmationModal(window.app, { cta, onAccept, text, title, fileDate }).open();
}