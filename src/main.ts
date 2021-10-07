import { Plugin, TFile, moment } from 'obsidian';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import { addIcons } from './icons';
import { Settings, DEFAULT_SETTINGS, SettingsTab } from './ui/settings';
import CalendarPicker from './ui/calendarPicker';
import DateNLP_Modal from './ui/datenlpModal';
import { createConfirmationDialog } from './ui/confirmationModal';

export default class ThePlugin extends Plugin {
	settings: Settings;
	ribbonIcon: HTMLElement;
	datePicker: CalendarPicker;

	async onload(): Promise<void> {
		console.log('loading Obsidian42 Jump-to-Date plugin');

		this.datePicker = new CalendarPicker(this);

		await this.loadSettings();

		addIcons();

		if (this.settings.enableRibbon)
			this.configureRibbonCommand();

		this.addCommand({
			id: 'open-JumpToDate-calendar',
			name: 'Date Picker',
			checkCallback: (check: boolean) => {
				if (check)
					return this.settings.enableRibbon;
				else
					setTimeout(() => { this.datePicker.open() }, 250);//need small delay when called from command palette
			}
		});

		this.app.workspace.onLayoutReady((): void => {
			// If the Natural Language Date plugin is installed, enable this additional command
			// otherwise the command is not available
			// @ts-ignore
			if (this.app.plugins.getPlugin('nldates-obsidian')) {
				this.addCommand({
					id: 'open-JumpToDate-nlp',
					name: 'Natural Language Date',
					callback: () => {
						const dt = new DateNLP_Modal(this.app, this);
						dt.open();
					}
				});
			}
			const ribbonButton = document.querySelector('.side-dock-ribbon-action[aria-label="Jump-to-Date')
			if (ribbonButton) {
				ribbonButton.addEventListener('mouseup', async (event: MouseEvent) => {
					event.preventDefault();
					if (event.button === 2) // right mouse click - open today's DNP right away
						await this.navigateToDNP(moment().format("YYYY-MM-DD"), false, event.ctrlKey, event.shiftKey)
					else  // any other button
						this.datePicker.open();
				});
			}
		})

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload(): void {
		console.log('unloading Obsidian42 Jump-to-Date plugin');
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	configureRibbonCommand(): void {
		this.ribbonIcon = this.addRibbonIcon('JumpToDate', 'Jump-to-Date', async () => { }); // see event listener for handling of this feature
	}

	setFirstDayofWeek(dayOfWeek: number): void {
		this.datePicker.setFirstDayofWeek(dayOfWeek);
	}

	async navigateToDNP(dateStr: string, shouldConfirmBeforeCreate = true, newPane = false, newHorizontalPane = false): Promise<void> {
		const openFile = (fileToOpen: TFile, openInNewPane: boolean, openInHorizontalPane: boolean) => {
			if (newPane && openInHorizontalPane) {
				// @ts-ignore
				const newLeaf = app.workspace.splitActiveLeaf('horizontal');
				// const newLeaf = app.workspace.createLeafBySplit(app.workspace.getLeaf(), 'horizontal', false);
				newLeaf.openFile(fileToOpen, { active: true });
			} else if (openInNewPane) {
				// @ts-ignore
				const newLeaf = app.workspace.splitActiveLeaf('vertical');
				// const newLeaf = app.workspace.createLeafBySplit(app.workspace.getLeaf(), 'vertical', false);
				newLeaf.openFile(fileToOpen, { active: true });
			} else {
				// @ts-ignore
				app.workspace.getLeaf().openFile(fileToOpen);
			}
		}

		const dateForDNPToOpen = moment(new Date(dateStr + 'T00:00:00'));

		const dnpFileThatExistsInVault = getDailyNote(dateForDNPToOpen, getAllDailyNotes());

		if (dnpFileThatExistsInVault != null) {
			openFile(dnpFileThatExistsInVault, newPane, newHorizontalPane);
		} else {
			if (shouldConfirmBeforeCreate === true) {
				createConfirmationDialog({
					cta: "Create",
					onAccept: async (dateStr): Promise<void> => {
						const newDate = moment(new Date(dateStr));
						openFile(await createDailyNote(newDate), newPane, newHorizontalPane);
					},
					text: `File ${dateStr} does not exist. Would you like to create it?`,
					title: "New Daily Note",
					fileDate: dateForDNPToOpen.format('YYYY-MM-DD') + 'T00:00:00'
				});
			} else {
				openFile(await createDailyNote(dateForDNPToOpen), newPane, newHorizontalPane);
			}
		}
	}

}

