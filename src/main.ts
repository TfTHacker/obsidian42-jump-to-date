import { Plugin } from 'obsidian';
import { addIcons } from './icons';
import { Settings, DEFAULT_SETTINGS, SettingsTab } from './settings';
import CalendarPicker from './calendarPicker';

export default class ThePlugin extends Plugin {
	settings: Settings;
	ribbonIcon: HTMLElement;
	datePicker: CalendarPicker;

	async onload() {
		console.log('loading JumpToDate plugin');

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		addIcons();

		if (this.settings.enableRibbon)
			this.configureRibbonCommand();

		this.addCommand({
			id: 'open-JumpToDate-suggestor',
			name: 'Date Picker',
			callback: () => {
				this.datePicker.open()
			}
		});

		this.datePicker = new CalendarPicker(this);
	}

	onunload() {
		console.log('unloading JumpToDate plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	configureRibbonCommand() {
		this.ribbonIcon = this.addRibbonIcon('JumpToDate', 'Jump to Date', async () => this.datePicker.open())
	}

}

