import { Pipe, PipeTransform } from '@angular/core';

interface ListStrategy {
  size(obj: Array<any> | Object): number;
  print(obj: Array<any> | Object): string;
  contains(obj: Array<any> | Object, item: any): boolean;
  groupBy(obj: Array<any> | Object, key: string): Object | Array<Object> | never;
}

class StrategySelector {
  static ARRAY_STRATEGY = new class implements ListStrategy {
    size(obj: Array<any>) {
      return obj.length;
    }
    print(obj: Array<any>) {
      return obj.join(', ');
    }
    contains(obj: Array<any>, item: any) {
      return obj.includes(item);
    }
    groupBy(obj: Array<any>, property: string): Array<Object> {
      const grouped = obj.reduce((groupedObj, item) => {
        const key = item[property];
        if (!groupedObj[key]) {
          groupedObj[key] = [];
        }
        groupedObj[key].push(item);
        return groupedObj;
      }, {});

      // convert the grouped object to an array of objects that ngFor can iterate over
      return Object.entries(grouped).map(([key, value]) => ({ key, value }));
    }

  }();

  static OBJECT_STRATEGY = new class implements ListStrategy {
    size(obj: Object) {
      return Object.keys(obj).length;
    }
    print(obj: Object) {
      return Object.entries(obj).map(([key, val]) => `${key}: ${val}`).join(', ');
    }
    contains(obj: Object, key: string) {
      return obj.hasOwnProperty(key);
    }
    groupBy(obj: Object, key: string): Object | never {
      throw new Error("groupBy function is not implemented for objects.");
    }
  }();

  static selectStrategy(val: Array<any> | Object | null | undefined) {
    if (Array.isArray(val)) {
      return StrategySelector.ARRAY_STRATEGY;
    }

    if (typeof val === 'object' && val !== null) {
      return StrategySelector.OBJECT_STRATEGY;
    }

    throw new Error(`InvalidArrayOrObjectArgumentError: The provided value should be an array or an object. Received: ${typeof val}.`);
  }
}

class List {
  private _obj: Array<any> | Object;
  private _strategy: ListStrategy;

  constructor(obj: Array<any> | Object) {
    this._obj = obj;
    this._strategy = StrategySelector.selectStrategy(obj);

  }

  size() {
    return this._strategy.size(this._obj);
  }

  print() {
    return this._strategy.print(this._obj);
  }

  contains(item: any) {
    return this._strategy.contains(this._obj, item);
  }

  groupBy(key: string) {
    return this._strategy.groupBy(this._obj, key);
  }
}

@Pipe({
  name: 'listPipe',
  pure: true,
  standalone: true,
})
export class ListPipe implements PipeTransform {

  transform(value: any, method: string, arg?: any): any {
    const list = new List(value);

    switch (method) {
      case 'size':
        return list.size();
      case 'print':
        return list.print();
      case 'contains':
        return list.contains(arg);
      case 'groupBy':
        return list.groupBy(arg);
      default:
        throw new Error(`InvalidMethodArgumentError: The provided method is not supported. Received: ${method}.`);
    }
  }
}
