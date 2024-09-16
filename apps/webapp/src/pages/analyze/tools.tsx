import { Layout } from "@/components/Layout";
import { ReactElement } from "react";

function ToolsPage() {
    return ( 
        <>
        
            Tools
        </>
     );
}

export default ToolsPage;

ToolsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };