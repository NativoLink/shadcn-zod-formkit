import { IPermission } from "./FormTest";
import { InputOption } from 'shadcn-zod-formkit';

export const listOptions:InputOption[] = [
    { id: 1, name: "Administrator", value: "admin" },
    { id: 2, name: "Editor", value: "editor" },
    { id: 3, name: "Reader", value: "reader" },
]

export const mockPermissions: IPermission[]  = [
    {
        id: "1",
        name: "user.create",
        description: "Permite crear nuevos Users en el sistema",
        category: "Users",
    },
    {
        id: "2",
        name: "user.read",
        description: "Permite ver la lista de Users y sus detalles",
        category: "Users",
    },
    {
        id: "3",
        name: "user.update",
        description: "Permite modificar información de los Users",
        category: "Users",
    },
    {
        id: "4",
        name: "user.delete",
        description: "Permite eliminar Users del sistema",
        category: "Users",
    },
    {
        id: "5",
        name: "post.create",
        description: "Permite crear nuevas Products o artículos",
        category: "Products",
    },
    {
        id: "6",
        name: "post.read",
        description: "Permite leer Products y artículos existentes",
        category: "Products",
    },
    {
        id: "7",
        name: "post.update",
        description: "Permite editar Products existentes",
        category: "Products",
    },
    {
        id: "8",
        name: "post.delete",
        description: "Permite eliminar Products del sistema",
        category: "Products",
    },
    {
        id: "9",
        name: "reports.view",
        description: "Permite acceder a los reports del sistema",
        category: "Reports",
    },
];