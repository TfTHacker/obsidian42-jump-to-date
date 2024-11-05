import { addIcon } from "obsidian";

export function addIcons(): void {
	addIcon(
		"JumpToDate",
		`<path fill="currentColor" stroke="currentColor" d="M 36.445312 55.1875 C 36.445312 53.933594 35.429688 52.917969 34.175781 52.917969 L 26.25 52.917969 C 25 52.917969 23.984375 53.933594 23.984375 55.1875 L 23.984375 63.109375 C 23.984375 64.363281 25 65.378906 26.25 65.378906 L 34.175781 65.378906 C 35.429688 65.378906 36.445312 64.363281 36.445312 63.109375 Z M 36.445312 55.1875 "/>
        <path fill="currentColor" stroke="currentColor" d="M 56.246094 55.1875 C 56.246094 53.933594 55.230469 52.917969 53.976562 52.917969 L 46.054688 52.917969 C 44.800781 52.917969 43.785156 53.933594 43.785156 55.1875 L 43.785156 63.109375 C 43.785156 64.363281 44.800781 65.378906 46.054688 65.378906 L 53.976562 65.378906 C 55.230469 65.378906 56.246094 64.363281 56.246094 63.109375 Z M 56.246094 55.1875 "/>
        <path fill="currentColor" stroke="currentColor" d="M 76.046875 55.1875 C 76.046875 53.933594 75.03125 52.917969 73.78125 52.917969 L 65.855469 52.917969 C 64.601562 52.917969 63.585938 53.933594 63.585938 55.1875 L 63.585938 63.109375 C 63.585938 64.363281 64.601562 65.378906 65.855469 65.378906 L 73.78125 65.378906 C 75.03125 65.378906 76.046875 64.363281 76.046875 63.109375 Z M 76.046875 55.1875 "/>
        <path fill="currentColor" stroke="currentColor" d="M 36.445312 74.988281 C 36.445312 73.734375 35.429688 72.71875 34.175781 72.71875 L 26.25 72.71875 C 25 72.71875 23.984375 73.734375 23.984375 74.988281 L 23.984375 82.910156 C 23.984375 84.164062 25 85.179688 26.25 85.179688 L 34.175781 85.179688 C 35.429688 85.179688 36.445312 84.164062 36.445312 82.910156 Z M 36.445312 74.988281 "/>
        <path fill="currentColor" stroke="currentColor" d="M 56.246094 74.988281 C 56.246094 73.734375 55.230469 72.71875 53.976562 72.71875 L 46.054688 72.71875 C 44.800781 72.71875 43.785156 73.734375 43.785156 74.988281 L 43.785156 82.910156 C 43.785156 84.164062 44.800781 85.179688 46.054688 85.179688 L 53.976562 85.179688 C 55.230469 85.179688 56.246094 84.164062 56.246094 82.910156 Z M 56.246094 74.988281 "/>
        <path fill="currentColor" stroke="currentColor" d="M 76.046875 74.988281 C 76.046875 73.734375 75.03125 72.71875 73.78125 72.71875 L 65.855469 72.71875 C 64.601562 72.71875 63.585938 73.734375 63.585938 74.988281 L 63.585938 82.910156 C 63.585938 84.164062 64.601562 85.179688 65.855469 85.179688 L 73.78125 85.179688 C 75.03125 85.179688 76.046875 84.164062 76.046875 82.910156 Z M 76.046875 74.988281 "/>
        <path fill="currentColor" stroke="currentColor" d="M 90.214844 11.136719 L 90.214844 23.238281 C 90.214844 28.707031 85.777344 33.113281 80.3125 33.113281 L 74.0625 33.113281 C 68.59375 33.113281 64.097656 28.707031 64.097656 23.238281 L 64.097656 11.09375 L 35.933594 11.09375 L 35.933594 23.238281 C 35.933594 28.707031 31.4375 33.113281 25.96875 33.113281 L 19.71875 33.113281 C 14.253906 33.113281 9.816406 28.707031 9.816406 23.238281 L 9.816406 11.136719 C 5.035156 11.28125 1.109375 15.238281 1.109375 20.097656 L 1.109375 91.011719 C 1.109375 95.964844 5.121094 100.03125 10.074219 100.03125 L 89.957031 100.03125 C 94.902344 100.03125 98.921875 95.957031 98.921875 91.011719 L 98.921875 20.097656 C 98.921875 15.238281 94.996094 11.28125 90.214844 11.136719 Z M 87.3125 86.597656 C 87.3125 88.734375 85.578125 90.472656 83.4375 90.472656 L 16.421875 90.472656 C 14.28125 90.472656 12.546875 88.734375 12.546875 86.597656 L 12.546875 49.964844 C 12.546875 47.824219 14.28125 46.089844 16.421875 46.089844 L 83.4375 46.089844 C 85.578125 46.089844 87.3125 47.824219 87.3125 49.964844 Z M 87.3125 86.597656 "/>
        <path fill="currentColor" stroke="currentColor" d="M 19.699219 26.628906 L 25.878906 26.628906 C 27.753906 26.628906 29.277344 25.109375 29.277344 23.234375 L 29.277344 3.394531 C 29.277344 1.519531 27.753906 0 25.878906 0 L 19.699219 0 C 17.820312 0 16.300781 1.519531 16.300781 3.394531 L 16.300781 23.234375 C 16.300781 25.109375 17.820312 26.628906 19.699219 26.628906 Z M 19.699219 26.628906 "/>
        <path fill="currentColor" stroke="currentColor" d="M 73.984375 26.628906 L 80.164062 26.628906 C 82.039062 26.628906 83.558594 25.109375 83.558594 23.234375 L 83.558594 3.394531 C 83.558594 1.519531 82.039062 0 80.164062 0 L 73.984375 0 C 72.105469 0 70.585938 1.519531 70.585938 3.394531 L 70.585938 23.234375 C 70.585938 25.109375 72.105469 26.628906 73.984375 26.628906 Z M 73.984375 26.628906 "/>`,
	);
}
