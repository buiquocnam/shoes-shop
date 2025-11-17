"use client";

import { useState, useEffect } from 'react';
import { CategoryType } from "../types";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategory?: string;
  categories?: CategoryType[];
}

export default function Sidebar({ selectedCategory, categories: initialCategories }: SidebarProps) {
  const router = useRouter();
  const [categories] = useState<CategoryType[]>(initialCategories || []);

 // Tính expandedRootItems ngay khi init
  const initialExpandedRootItems = (() => {
    if (!selectedCategory) return [];

    const parent = (initialCategories || []).find(cat =>
      cat.children?.some(child => child.id === selectedCategory)
    );

    return parent ? [parent.id] : [];
  })();

  const [expandedRootItems, setExpandedRootItems] = useState<string[]>(initialExpandedRootItems);


  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?categories_id=${categoryId}`);
  };

  return (
    <div className="w-full min-w-[200px]">
      <h2 className="font-semibold text-lg mb-3">Danh mục sản phẩm</h2>
      <Accordion
        type="multiple"
        className="w-full"
        value={expandedRootItems}
        onValueChange={setExpandedRootItems}
      >
        {categories.filter(cat => !cat.parentId).map((root) => {
          const isRootActive = selectedCategory === root.id || root.children?.some(c => c.id === selectedCategory);
          const rootChildren = root.children || [];

          return (
            <AccordionItem key={root.id} value={root.id} className="border-b">
              <AccordionTrigger
                className={cn(
                  "hover:bg-gray-50 p-3 [&>svg]:hidden",
                  isRootActive && "text-blue-600 font-semibold bg-blue-50"
                )}
              >
                {root.name}

                {rootChildren.length > 0 && (
                  <span className="ml-2 font-semibold rounded-full bg-blue-500 text-white flex items-center justify-center min-w-6 min-h-6 text-xs">
                    {rootChildren.length}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                {rootChildren.length > 0 ? (
                  <ul className="space-y-1">
                    {rootChildren.map((child) => {
                      const isChildActive = selectedCategory === child.id;
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => handleCategoryClick(child.id)}
                            className={cn(
                              "w-full text-left text-sm px-3 py-2 rounded transition-color cursor-pointer",
                              isChildActive
                                ? "bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {child.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 ml-3">Không có danh mục con</p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
