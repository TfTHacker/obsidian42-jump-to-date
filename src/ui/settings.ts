import { App, PluginSettingTab, Setting, ToggleComponent } from 'obsidian';
import ThePlugin from '../main';
import JumpToDatePlugin from '../main';

export interface Settings {
	enableRibbon: boolean,
	shouldConfirmBeforeCreate: boolean,
	firstDayOfWeekIsSunday: boolean
}

export const DEFAULT_SETTINGS: Settings = {
	enableRibbon: true,
	shouldConfirmBeforeCreate: false,
	firstDayOfWeekIsSunday: true
}

export class SettingsTab extends PluginSettingTab {
	plugin: ThePlugin;

	constructor(app: App, plugin: JumpToDatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Obsidian42 - Jump-to-Date Setting' });
		new Setting(containerEl)
			.setName('Enable Calendar Popup')
			.setDesc('Toggle on and off the Jump-to-Date button in the ribbon and command palette. If this is disabled, the Natural Language Date feature is still available in the command palette')
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.enableRibbon);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.enableRibbon = value;
					if (this.plugin.settings.enableRibbon === false)
						this.plugin.ribbonIcon.remove();
					else
						this.plugin.showRibbonButton();
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Confirm before creating new note')
			.setDesc('Show a confirmation modal before creating a new note.')
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.shouldConfirmBeforeCreate);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.shouldConfirmBeforeCreate = value;
					await this.plugin.saveSettings();
				});
			});
			
			new Setting(containerEl)
			.setName('First day of the week on calendar is Sunday')
			.setDesc('If toggled on the calendar will show the week starting with Sunday. If toggled off, it will show Monday as the starting day.')
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.firstDayOfWeekIsSunday);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.firstDayOfWeekIsSunday = value;
					await this.plugin.saveSettings();
				});
			});
 
	}
}
