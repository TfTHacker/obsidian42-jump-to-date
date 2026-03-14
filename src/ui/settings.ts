import {
	type App,
	PluginSettingTab,
	Setting,
	type ToggleComponent,
} from "obsidian";
import type JumpToDatePlugin from "../main";

export interface Settings {
	shouldConfirmBeforeCreate: boolean;
	firstDayOfWeekIsSunday: boolean;
	showDayDifferenceOnCalendar: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	shouldConfirmBeforeCreate: false,
	firstDayOfWeekIsSunday: true,
	showDayDifferenceOnCalendar: false,
};

export class SettingsTab extends PluginSettingTab {
	plugin: JumpToDatePlugin;

	constructor(app: App, plugin: JumpToDatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Confirm before creating new note")
			.setDesc("Show a confirmation modal before creating a new note.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.shouldConfirmBeforeCreate);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.shouldConfirmBeforeCreate = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("First day of the week on calendar is Sunday")
			.setDesc(
				"If toggled on the calendar will show the week starting with Sunday. If toggled off, it will show Monday as the starting day.",
			)
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.firstDayOfWeekIsSunday);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.firstDayOfWeekIsSunday = value;
					await this.plugin.saveSettings();
				});
			});

			
		new Setting(containerEl)
			.setName("Show time difference from today on calendar days")
			.setDesc(
				"If toggled on the calendar will show the number of days difference from today on each day in the calendar, and for the current date if the time is between midnight and 4AM, it will add a moon emoji.",
			)
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showDayDifferenceOnCalendar);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showDayDifferenceOnCalendar = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
