export class ThrottlingExecutor {
    private to = 0;

    constructor(private timeout: number = 100) {
    }

    public schedule(action: () => void, changedTimeout?: number): void {
        this.destroy();
        this.to = window.setTimeout(action, changedTimeout ?? this.timeout);
    }

    public destroy(): void {
        if (this.to) {
            clearTimeout(this.to);
        }
    }
}
