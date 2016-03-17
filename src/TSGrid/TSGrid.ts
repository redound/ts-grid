module TSGrid {

    /**
     * Add Custom Extensions here
     */
    export var Extension = {};

    export function resolveNameToClass<T>(name, suffix: string = ''): T {

        if (_.isString(name)) {
            var key = _.map(name.split('-'), (e:any) => {
                    return e.slice(0, 1).toUpperCase() + e.slice(1);
                }).join('') + suffix;
            var klass = TSGrid[key] || TSGrid.Extension[key];
            if (_.isUndefined(klass)) {
                throw new ReferenceError("Class '" + key + "' not found");
            }
            return klass;
        }

        return name;
    }

    export function callByNeed(...arg: any[]) {

        var value = arguments[0];
        if (!_.isFunction(value)) return value;

        var context = arguments[1];
        var args = [].slice.call(arguments, 2);
        return value.apply(context, !!(args + '') ? args : []);
    }

    export module TSGridEvents {

        export const RENDERED = "tsGrid:rendered";
        export const REFRESH = "tsGrid:refresh";
        export const SORT = "tsGrid:sort";
        export const EDIT = "tsGrid:edit";
        export const EDITING = "tsGrid:editing";
        export const EDITED = "tsGrid:edited";
        export const ERROR = "tsGrid:error";
        export const NEXT = "tsGrid:next";
        export const NAVIGATE = "tsGrid:navigate";
        export const CHANGED_WIDTH = "tsGrid:changedWidth";
        export const CLICK = "tsGrid:click";
    }
}