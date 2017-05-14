// UITBREIDING: generieke methode voor Function objecten die kan gebruikt worden
//              om een methode toe te voegen aan aan het prototype van het
//              Function object; op die manier kan het gegoochel met prototypes
//              verborgen worden
Function.prototype.method = function (name, func) {

    // koppel functie aan eigenschap van prototype met opgegeven naam indien
    // het prototype nog geen eigenschap had met die naam
    if (!this.prototype.hasOwnProperty(name)) {
        Object.defineProperty(
            this.prototype,
            name,
            {
                value: func,
                enumerable: false
            }
        );
    }

    // geef functie terug zodat method calls aaneengeschakeld kunnen worden
    return this;

};