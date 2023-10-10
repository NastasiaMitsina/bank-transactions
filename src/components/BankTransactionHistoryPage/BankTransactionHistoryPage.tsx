import React, { useEffect, useMemo, useState } from 'react';
import { UserTransactionTable } from '../TransactionTable/TransactionTable';
import { TransactionsData, User, Transaction } from '../../types/global';
import './BankTransactionHistoryPage.css';

export const BankTransactionHistoryPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    const userTransactions: Transaction[] = useMemo(() => {
        return transactions.filter(
            (transaction) =>
                transaction.sourceId === selectedUserId || transaction.targetId === selectedUserId
        )
    }, [selectedUserId, transactions])

    const filteredBySearch: Transaction[] = userTransactions.filter((transaction) => {
        return (
            transaction.amount.toString().includes(searchTerm)
        )
    })

    const userAmount = useMemo(() => (
        filteredBySearch.reduce((total, cur) => total + cur.amount, 0).toFixed(2)
    ), [filteredBySearch])

    const fetchTransactionsData = async (): Promise<void> => {
        try {
            const response: Response = await fetch('/server/task_data.json')

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: TransactionsData = await response.json()

            setUsers(data.users)
            setSelectedUserId(data.users[0].id)
            setTransactions(data.transactions)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => { fetchTransactionsData() }, [])

    return (
        <div className="container">
            <h1>Bank transaction history</h1>
            <div className="select-container">
                <label>Select user:</label>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="search-container">
            <label>Search:</label>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
            <h3>Current account balance: {userAmount}</h3>
            <UserTransactionTable transactions={filteredBySearch} selectedUserId={selectedUserId} />
        </div>
    )
}
