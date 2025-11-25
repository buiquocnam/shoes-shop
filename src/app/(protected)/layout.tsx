
import { ReactNode } from "react";
/**
 * Protected routes layout
 * - Middleware đã handle authentication check
 * - Chỉ cần show loading state khi store chưa hydrate
 */
const Layout = ({ children }: { children: ReactNode }) => {
  
    return <>{children}</>;
};

export default Layout;