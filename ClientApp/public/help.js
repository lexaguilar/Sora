if (!Array.prototype.sum) {
    Array.prototype.sum = function(element) {
        if (element)
            return this.reduce((a, b) => (+a) + (+b[element]), 0);
        else
            return this.reduce((a, b) => (+a) + (+b), 0);
    }
}