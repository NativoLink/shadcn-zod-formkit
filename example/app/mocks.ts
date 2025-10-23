import { InputOption } from "../../dist/index.mjs";
import { IPermission } from "./FormTest";

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
        createdAt: "2025-01-10T12:00:00Z",
        updatedAt: "2025-01-15T08:30:00Z",
    },
    {
        id: "2",
        name: "user.read",
        description: "Permite ver la lista de Users y sus detalles",
        category: "Users",
        createdAt: "2025-01-10T12:00:00Z",
        updatedAt: "2025-01-15T08:30:00Z",
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
        name: "settings.manage",
        description: "Permite acceder y modificar la Checks general del sistema",
        category: "Checks",
    },
    {
        id: "10",
        name: "reports.view",
        description: "Permite acceder a los reports del sistema",
        category: "Reports",
    },
];