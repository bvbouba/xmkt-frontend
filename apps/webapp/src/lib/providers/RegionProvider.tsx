import { ReactNode, createContext, useContext } from "react";

type RegionContextProps = {
    locale: string;
  };
  
  const RegionContext = createContext<RegionContextProps | undefined>(undefined);
  
  export const useRegion = () => {
    const context = useContext(RegionContext);
    if (!context) {
      throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
  };
  
  type RegionProviderProps = {
    locale: string;
    children: ReactNode;
  };
  
  export const RegionProvider = ({ locale, children }: RegionProviderProps) => {
    return (
      <RegionContext.Provider value={{ locale }}>
        {children}
      </RegionContext.Provider>
    );
  };