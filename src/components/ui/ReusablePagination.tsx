"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "./pagination";

interface ReusablePaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export function ReusablePagination({
    currentPage,
    totalPages,
    className,
}: ReusablePaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const createUrl = (page: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', page.toString());
        return `${pathname || ''}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        router.push(createUrl(page));
    };

    if (totalPages <= 1) return null;

    // Tính toán các page numbers để hiển thị
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <Pagination className={className}>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={createUrl(currentPage - 1)}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                            }}
                        />
                    </PaginationItem>
                )}

                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={createUrl(page)}
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href={createUrl(currentPage + 1)}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
