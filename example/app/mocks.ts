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
        description: "Permite crear nuevos usuarios en el sistema",
        category: "Usuarios",
        createdAt: "2025-01-10T12:00:00Z",
        updatedAt: "2025-01-15T08:30:00Z",
    },
    {
        id: "2",
        name: "user.read",
        description: "Permite ver la lista de usuarios y sus detalles",
        category: "Usuarios",
        createdAt: "2025-01-10T12:00:00Z",
        updatedAt: "2025-01-15T08:30:00Z",
    },
    {
        id: "3",
        name: "user.update",
        description: "Permite modificar información de los usuarios",
        category: "Usuarios",
    },
    {
        id: "4",
        name: "user.delete",
        description: "Permite eliminar usuarios del sistema",
        category: "Usuarios",
    },
    {
        id: "5",
        name: "post.create",
        description: "Permite crear nuevas publicaciones o artículos",
        category: "Contenido",
    },
    {
        id: "6",
        name: "post.read",
        description: "Permite leer publicaciones y artículos existentes",
        category: "Contenido",
    },
    {
        id: "7",
        name: "post.update",
        description: "Permite editar publicaciones existentes",
        category: "Contenido",
    },
    {
        id: "8",
        name: "post.delete",
        description: "Permite eliminar publicaciones del sistema",
        category: "Contenido",
    },
    {
        id: "9",
        name: "settings.manage",
        description: "Permite acceder y modificar la configuración general del sistema",
        category: "Administración",
    },
    {
        id: "10",
        name: "reports.view",
        description: "Permite acceder a los reportes del sistema",
        category: "Reportes",
    },
];