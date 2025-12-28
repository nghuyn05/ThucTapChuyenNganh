module.exports = {
    range: function (from, to) {
        const arr = [];
        for (let i = from; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    },

    ifEquals: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    }
};
