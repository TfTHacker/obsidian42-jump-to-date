import flatpickr from "flatpickr";
import { Platform, type View, moment } from "obsidian";
import { getDailyNoteSettings } from "obsidian-daily-notes-interface";
import type JumpToDatePlugin from "../main";

export default class CalendarPicker {
	plugin: JumpToDatePlugin;
	picker: flatpickr.Instance = null;

	constructor(plugin: JumpToDatePlugin) {
		this.plugin = plugin;
	}

	open(): void {
		if (this.picker?.isOpen) {
			// if open already, just close it
			this.picker.destroy();
			this.picker = null;
			return;
		}

		// some additional cleanup in case something lingers behind each use
		if (document.querySelector(".obsidian42-jump-to-date")) {
			for (const element of document.querySelectorAll(
				".obsidian42-jump-to-date",
			)) {
				element.remove();
			}
		}

		this.initializePicker();

		// since the event of the date picker is called in different context, need to store a pointer to the function
		// @ts-ignore
		this.picker.shouldConfirmBeforeCreate =
			this.plugin.settings.shouldConfirmBeforeCreate;
		let currentlySelectedDate: moment.Moment = moment();
		const activeView: View = this.plugin.app.workspace.getLeaf().view;
		try {
			if (
				activeView.file &&
				moment(
					activeView.file.basename,
					getDailyNoteSettings().format,
					true,
				).isValid()
			) {
				// @ts-ignore
				currentlySelectedDate = moment(
					activeView.file.basename,
					getDailyNoteSettings().format,
					true,
				);
			}
		} catch (e) {
			console.log(e);
		}

		this.picker.setDate(currentlySelectedDate.format("Y-MM-D"));

		this.picker.open();

		// Next few lines of code set focus and prepare control to be navigated by keybaord. Requires simulating one Arrow key press to make it active
		const daySelected: HTMLElement = document.querySelector(
			".obsidian42-jump-to-date .flatpickr-day.selected",
		);
		daySelected.focus();
		daySelected.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight" }),
		);
		daySelected.focus();
	}

	initializePicker(): void {
		const startingDayInWeek = this.plugin.settings.firstDayOfWeekIsSunday
			? 0
			: 1;

		// create and initialize settings in the calendar picker
		if (this.picker !== null) this.picker.destroy();

		const querySelectorPathForParent =
			Platform.isMobileApp || Platform.isMobile
				? ".mobile-navbar-action"
				: 'div[aria-label="Jump-to-Date"]';

		this.picker = flatpickr(
			document.querySelector(querySelectorPathForParent),
			{
				onChange: async (selectedDates, dateStr, instance) => {
					// @ts-ignore
					await instance.navigateToDNP(
						dateStr,
						instance.shouldConfirmBeforeCreate,
						instance.controlKeyPressed,
						instance.shiftKeyPressed,
					);
					instance.destroy();
				},
				disableMobile: true,
				locale: { firstDayOfWeek: startingDayInWeek },
			},
		);

		this.picker.calendarContainer.addClass("obsidian42-jump-to-date");

		this.picker.calendarContainer.addEventListener(
			"keydown",
			(e: KeyboardEvent) => {
				// @ts-ignores
				this.picker.controlKeyPressed = e.ctrlKey || e.metaKey;
				// @ts-ignore
				this.picker.shiftKeyPressed = e.shiftKey;
			},
		);

		this.picker.calendarContainer.addEventListener(
			"keyup",
			(e: KeyboardEvent) => {
				if (e.key === "Enter") {
					// @ts-ignore
					const newDate = moment(new Date(e.target.dateObj)).format("Y-MM-D");
					// @ts-ignore
					this.picker.navigateToDNP(
						newDate,
						this.picker.shouldConfirmBeforeCreate,
						e.ctrlKey || e.metaKey,
						e.shiftKey,
					);
					this.picker.destroy();
					this.picker = null;
				} else {
					// @ts-ignores
					this.picker.controlKeyPressed = e.ctrlKey || e.metaKey;
					// @ts-ignore
					this.picker.shiftKeyPressed = e.shiftKey;
				}
			},
		);

		this.picker.daysContainer.addEventListener("click", (e: MouseEvent) => {
			// @ts-ignores
			this.picker.controlKeyPressed = e.ctrlKey || e.metaKey;
			// @ts-ignore
			this.picker.shiftKeyPressed = e.shiftKey;
		});

		this.picker.daysContainer.addEventListener(
			"contextmenu",
			(e: MouseEvent) => {
				// @ts-ignore
				const newDate = moment(new Date(e.target.dateObj)).format("Y-MM-D");
				// @ts-ignore
				this.picker.navigateToDNP(
					newDate,
					this.picker.shouldConfirmBeforeCreate,
					true,
					this.picker.shiftKeyPressed,
				);
				this.picker.destroy();
			},
		);

		// @ts-ignore
		this.picker.navigateToDNP = this.plugin.navigateToDNP;
		// @ts-ignore
		this.picker.controlKeyPressed = false; // tracks if CTRL key is being held down
		// @ts-ignore
		this.picker.shiftKeyPressed = false; // tracks if CTRL key is being held down
	}

	setFirstDayofWeek(dayOfWeek: number): void {
		this.picker.set("locale", { firstDayOfWeek: dayOfWeek });
	}
}
