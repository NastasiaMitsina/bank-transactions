import React from 'react';
import './Pagination.css';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const visiblePages = 8;
    const halfVisiblePages = Math.floor(visiblePages / 2);
    const pages = [];

    if (totalPages <= visiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else if (currentPage <= halfVisiblePages) {
        for (let i = 1; i <= visiblePages - 2; i++) {
            pages.push(i);
        }

        pages.push('...');
        pages.push(totalPages);
    } else if (currentPage >= totalPages - halfVisiblePages) {
        pages.push(1);
        pages.push('...');

        for (let i = totalPages - visiblePages + 3; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        pages.push('...');

        for (let i = currentPage - halfVisiblePages; i <= currentPage + halfVisiblePages; i++) {
            pages.push(i);
        }

        pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="pagination">
            {pages.map((page, i) => (
                <button
                    key={i}
                    className={`page-button ${page === '...' ? 'ellipsis' : ''} ${page === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(typeof page === 'number' ? page : currentPage)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};
