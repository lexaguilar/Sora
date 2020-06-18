import { createProxy } from "./proxy";

const uri = {
    cuentas: createProxy('cuentas/get')

};

export default uri;