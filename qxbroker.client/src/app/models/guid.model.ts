export default class Guid {
    public static readonly Empty = '00000000000000000000000000000000';

    public static newGuid(): string {
        let res = '';
        const alphabet = '0123456789abcedf';
        for (let i = 0; i < 32; i++) {
            res += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return res;
    }

    public static toShortGuid(guid?: string): string {
        return guid?.split('-').join('') ?? '';
    }

    public static isEmptyGuid(value: string): boolean {
        if (value.replace(/-/g, '') === Guid.Empty) {
            return true;
        }

        return false;
    }

    public static isGuid(value: string): boolean {
        return this.isShortGuid(value) || this.isLongGuid(value);
    }

    public static isShortGuid(value: string): boolean {
        return new RegExp(/[a-f0-9]{32}/, 'i').test(value);
    }

    public static isLongGuid(value: string): boolean {
        return new RegExp(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, 'i').test(value);
    }
}
