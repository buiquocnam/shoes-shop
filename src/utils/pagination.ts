
export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
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
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return pages;
}


export function createPaginationUrl(
  params: URLSearchParams,
  page: number,
  basePath: string = "/products"
): string {
  const newParams = new URLSearchParams(params.toString());
  newParams.set("page", page.toString());
  return `${basePath}?${newParams.toString()}`;
}
