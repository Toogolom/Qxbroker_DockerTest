/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringUtils } from '../utils/string-utils';

export class BaseModel {
    protected mapFromJson(json: any): void {
        for (const key in json) {
            try {
                const propKey = StringUtils.uncapitalize(key);
                (this as any)[propKey] = json[key];
            } catch (e) {
                // do nothing
            }
        }
    }

    public getJson(): any {
        const result: any = {};
        for (const prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) {
                continue;
            }

            const inner: any = this[prop];
            if (inner) {
                if (Array.isArray(inner)) {
                    result[prop] = inner.map(item => item.getJson ? item.getJson() : item);
                } else if (inner.getJson) {
                    result[prop] = inner.getJson();
                } else {
                    result[prop] = inner;
                }
            } else {
                result[prop] = inner;
            }
        }

        return result;
    }

    public static create<T>(type: new (data: any) => T, data: any): T {
        return new type(data);
    }

    public static convertArray<T>(type: new (data: any) => T, data: any[]): T[] {
        if (!data) {
            return [];
        }

        return data.map(item => BaseModel.create(type, item));
    }

    public static convertArrayWithFactory<T>(factory: (from?: any) => T, data: any[]): T[] {
        if (!data) {
            return [];
        }

        return data.map(item => factory(item));
    }

    public static sortArray<T>(source: T[], field: string, asc: boolean, ignoreCase: boolean = false): T[] {
        const comparer = (x: T, y: T): number => {
            if (!field) {
                return 0;
            }
            if (!x && !y) {
                return 0;
            }
            if (!x && y) {
                return asc ? -1 : 1;
            }
            if (x && !y) {
                return asc ? 1 : -1;
            }

            const i1 = this.resolveFieldValue(x, field, ignoreCase);
            const i2 = this.resolveFieldValue(y, field, ignoreCase);

            return this.compareValues(i1, i2, asc);
        };

        return source.sort(comparer);
    }

    public static sortEntities<T extends { id: string }>(source: T[], field: string, asc: boolean, ignoreCase: boolean = false): T[] {
        const comparer = (x: T, y: T): number => {
            if (!field) {
                return 0;
            }
            if (!x && !y) {
                return 0;
            }
            if (!x && y) {
                return asc ? -1 : 1;
            }
            if (x && !y) {
                return asc ? 1 : -1;
            }

            const i1 = this.resolveFieldValue(x, field, ignoreCase);
            const i2 = this.resolveFieldValue(y, field, ignoreCase);
            if (i1 === i2) {
                return 0;
            }

            if (typeof (i1) === 'number' && typeof (i2) === 'number') {
                return (asc) ? (i1 - i2) : (i2 - i1);
            }

            return this.compareValues(i1, i2, asc) || this.compareValues(x.id, y.id, asc);
        };

        return source.sort(comparer);
    }

    public static resolveFieldValue(source: any, field: string, ignoreCase: boolean = false): any {
        let value = source[field];
        if (field.indexOf('.') > 0) {
            const parts = field.split('.');
            value = source;
            for (let i = 0; i < parts.length; i++) {
                const subfield = parts[i];
                if (value) {
                    value = value[subfield];
                }
            }
        }

        if (ignoreCase && typeof (value) === 'string') {
            value = value.toLowerCase();
        }

        return value;
    }

    public static compareValues(i1: any, i2: any, asc: boolean): number {
        if (!i1 && !i2) {
            return 0;
        }
        if (!i1 && i2) {
            return asc ? -1 : 1;
        }
        if (i1 && !i2) {
            return asc ? 1 : -1;
        }

        if (i1 === i2) {
            return 0;
        }
        if (i1 > i2) {
            return asc ? 1 : -1;
        } else {
            return asc ? -1 : 1;
        }
    }

    public static moveItem<T>(array: T[], from: number, to: number): T[] {
        if (!BaseModel.canMoveItem(array, from, to)) {
            return [];
        }

        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    }

    public static canMoveItem(array: any[], from: number, to: number): boolean {
        if (!array || from < 0 || to < 0 || from > array.length - 1 || to > array.length - 1 || from === to) {
            return false;
        }

        return true;
    }
}
