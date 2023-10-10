export type User = {
    id: string,
    name: string
}

export type Transaction = {
    sourceId: string,
    targetId: string,
    amount: number
}

export type TransactionsData = {
    users: User[],
    transactions: Transaction[]
}