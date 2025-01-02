export class StringUtils {
    public static isRelativeUrl(url: string): boolean {
        if (!url) {
            return true;
        }
        if (url.startsWith('http://')) {
            return false;
        }
        if (url.startsWith('https://')) {
            return false;
        }
        if (url.startsWith('//')) {
            return false;
        }
        return true;
    }

    public static uncapitalize(str: string): string {
        if (str.charAt(0) === str.charAt(0).toUpperCase()) {
            return str.charAt(0).toLocaleLowerCase() + str.slice(1);
        }
        return str;
    }

    public static isNullOrWhiteSpace(str?: string): boolean {
        if (typeof str === 'undefined' || str == null) {
            return true;
        }
        return str.replace(/\s/g, '').length < 1;
    }

    public static isAlpha(ch: string): boolean {
        if (ch >= 'A' && ch <= 'Z') {
            return true;
        }
        if (ch >= 'a' && ch <= 'z') {
            return true;
        }
        if (ch >= 'А' && ch <= 'Я') {
            return true;
        }
        if (ch >= 'а' && ch <= 'я') {
            return true;
        }
        return false;
    }

    public static isEnglishAlpha(ch: string): boolean {
        if (ch >= 'A' && ch <= 'Z') {
            return true;
        }
        if (ch >= 'a' && ch <= 'z') {
            return true;
        }
        return false;
    }

    public static isDigit(ch: string): boolean {
        return ch >= '0' && ch <= '9';
    }

    public static capitalize(str: string): string {
        if (!str) {
            return str;
        }

        return `${str[0].toUpperCase()}${str.substring(1)}`;
    }

    public static getNumberFromStr(str: string, defaultValue: number = 0): number {
        const number = Number.parseFloat(str.replace(',', '.'));
        return isNaN(number) ? defaultValue : number;
    }

    public static removeLineBreak(str: string): string {
        return str.replace(/(\r\n|\n|\r)/gm, '');
    }

    public static removeExtraWhiteSpaces(str: string): string {
        return str.replace(/\s+/g, ' ');
    }
}
