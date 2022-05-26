import { createContext, useState } from "react";

const VaultContext = createContext({});

export const VaultProvider = ({ children }) => {
    const [vault, setVault] = useState({});

    return (
        <VaultContext.Provider value={{ vault, setVault }}>
            {children}
        </VaultContext.Provider>
    )
}

export default VaultContext;