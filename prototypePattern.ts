/**
 * The example class that has cloning ability. We'll see how the values of field
 * with different types will be cloned.
 */
class Prototype {
    public primitive: any;
    public component: object;
    public circularReference: ComponentWithBackReference;

    public clone(): this {
        const clone = Object.create(this);
        console.log(this)
        console.log('c0', clone.primitive)
       clone.component = Object.create(this.component);

        // Cloning an object that has a nested object with backreference
        // requires special treatment. After the cloning is completed, the
        // nested object should point to the cloned object, instead of the
        // original object. Spread operator can be handy for this case.
        clone.circularReference = {
            ...this.circularReference,
             prototype: { ...this },
        };

        return clone;
    }
}
// 可以将克隆方法单独提取出来
function clone(obj) {
    const clone = Object.create(obj);
    console.log(obj)
    console.log('c0', clone.primitive)
    clone.component = Object.create(obj.component);

    // Cloning an object that has a nested object with backreference
    // requires special treatment. After the cloning is completed, the
    // nested object should point to the cloned object, instead of the
    // original object. Spread operator can be handy for this case.
    clone.circularReference = {
        ...obj.circularReference,
        prototype: { ...obj },
    };

    return clone;
}
class ComponentWithBackReference {
    public prototype;

    constructor(prototype: Prototype) {
        this.prototype = prototype;
    }
}

/**
 * The client code.
 */
function clientCode() {
    const p1 = new Prototype();
    console.log('0',p1)
    p1.primitive = 245;
    // p1.component = new Date();
    p1.component ={
        date:'111'
    }
    p1.circularReference = new ComponentWithBackReference(p1);
    console.log('1', p1)

    //const p2 = p1.clone();
    const p2 = clone(p1);
    if (p1.primitive === p2.primitive) {
        console.log('Primitive field values have been carried over to a clone. Yay!');
    } else {
        console.log('Primitive field values have not been copied. Booo!');
    }
    if (p1.component === p2.component) {
        console.log('Simple component has not been cloned. Booo!');
    } else {
        console.log('Simple component has been cloned. Yay!');
    }

    if (p1.circularReference === p2.circularReference) {
        console.log('Component with back reference has not been cloned. Booo!');
    } else {
        console.log('Component with back reference has been cloned. Yay!');
    }

    if (p1.circularReference.prototype === p2.circularReference.prototype) {
        console.log('Component with back reference is linked to original object. Booo!');
    } else {
        console.log('Component with back reference is linked to the clone. Yay!');
    }
    p2.primitive = 'p2'
    console.log(p1,p2,p2.component)
}

clientCode();