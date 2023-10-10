import React, { useState, useEffect } from 'react';
import { Pagination } from '../Pagination/Pagination';
import { Transaction } from '../../types/global';
import './TransactionTable.css';

const PAGE_SIZE: number = 8;

interface UserTransactionTableProps {
    transactions: Transaction[];
    selectedUserId: string;
}

export const UserTransactionTable: React.FC<UserTransactionTableProps> = ({ transactions, selectedUserId }) => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [sortColumn, setSortColumn] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<string>('')
    const [sortTypeDirection, setSortTypeDirection] = useState<string>('')

    const handlePageChange = (newPage: number): void => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (column: string): void => {
        if (column === sortColumn) {
            if (sortDirection === 'asc') {
                setSortDirection('desc')
            } else if (sortDirection === 'desc') {
                setSortDirection('none')
            } else {
                setSortDirection('asc')
            }
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }

        if (column === 'type') {
            if (sortTypeDirection === 'asc') {
                setSortTypeDirection('desc')
            } else if (sortTypeDirection === 'desc') {
                setSortTypeDirection('none')
            } else {
                setSortTypeDirection('asc')
            }
        } else {
            setSortTypeDirection('none')
        }
    };

    useEffect(() => {
        setCurrentPage(1)
    }, [transactions, selectedUserId])

    const renderSortedTable = () => {
        let sortedTransactions = [...transactions]

        if (sortColumn === 'amount') {
            sortedTransactions.sort((a, b) => {
                const multiplier = sortDirection === 'asc' ? 1 : sortDirection === 'desc' ? -1 : 0

                return (a.amount - b.amount) * multiplier;
            });
        }

        if (sortColumn === 'type') {
            sortedTransactions.sort((a, b) => {
                const multiplier = sortTypeDirection === 'asc' ? 1 : sortTypeDirection === 'desc' ? -1 : 0
                const aIsOutgoing = a.sourceId === selectedUserId
                const bIsOutgoing = b.sourceId === selectedUserId

                if (aIsOutgoing && !bIsOutgoing) {
                    return -multiplier
                } else if (!aIsOutgoing && bIsOutgoing) {
                    return multiplier
                } else {
                    return 0
                }
            })
        }

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

        return (
            <div className="table-container">
                <div className="table-header">
                    <div className="table-cell">
                        <button onClick={() => handleSortChange('amount')}>
                            Amount {sortColumn === 'amount' && sortDirection === 'asc' && '▲'}
                            {sortColumn === 'amount' && sortDirection === 'desc' && '▼'}
                        </button>
                    </div>
                    <div className="table-cell">
                        <button onClick={() => handleSortChange('type')}>
                            Type {sortColumn === 'type' && sortTypeDirection === 'asc' && '▲'}
                            {sortColumn === 'type' && sortTypeDirection === 'desc' && '▼'}
                        </button>
                    </div>
                </div>
                <div className="table-body">
                    {currentTransactions.map((transaction, index) => (
                        <div className="table-row" key={index}>
                            <div className="table-cell">{transaction.amount.toFixed(2)}</div>
                            <div className="table-cell">
                                {transaction.sourceId === selectedUserId ? 'Outgoing' : 'Incoming'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="transaction-table">
            <div className="pagination">
                <Pagination
                    totalPages={Math.ceil(transactions.length / PAGE_SIZE)}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            {renderSortedTable()}
        </div>
    )
}
