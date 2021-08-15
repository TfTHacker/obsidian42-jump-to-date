import { App, PluginSettingTab, Setting, ToggleComponent } from 'obsidian';
import ThePlugin from './main';
import { createConfirmationDialog } from "./modal";
import JumpToDatePlugin from './main';

export interface Settings {
	enableRibbon: boolean,
    shouldConfirmBeforeCreate: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	enableRibbon: true,
    shouldConfirmBeforeCreate: false
}

export class SettingsTab extends PluginSettingTab {
	plugin: ThePlugin;

	constructor(app: App, plugin: JumpToDatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Obsidian42 - Jump to Date Setting' });
		new Setting(containerEl)
			.setName('Enable Ribbon Support')
			.setDesc('Toggle on and off the Jumpt to Date button in the ribbon.')
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.enableRibbon);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.enableRibbon = value;
					if (this.plugin.settings.enableRibbon === false)
						this.plugin.ribbonIcon.remove();
					else
						this.plugin.configureRibbonCommand();

					await this.plugin.saveSettings();
				});
			});


            new Setting(containerEl)
                .setName("Confirm before creating new note")
                .setDesc("Show a confirmation modal before creating a new note")
                .addToggle((cb: ToggleComponent) => {
                    cb.setValue(this.plugin.settings.shouldConfirmBeforeCreate);
                    cb.onChange(async (value: boolean) => {
                        this.plugin.settings.shouldConfirmBeforeCreate = value;
                        await this.plugin.saveSettings();
                });
            });            
	}
}
