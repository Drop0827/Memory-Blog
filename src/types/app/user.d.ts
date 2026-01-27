export interface Login {
    username: string,
    password: string
}

export interface UserInfo {
    id?: number,
    name: string,
    email: string,
    avatar: string,
    info: string,
    roleId: number
    role: Role
}

export type User = Login & UserInfo

export interface LoginReturn {
    token: string,
    user: User,
    role: Role
}

export interface EditUser {
    username: string,
    oldPassword: string,
    newPassword: string
}