import { useContext } from "react";
import VaultContext from "../context/VaultProvider";

const useVault = () => {
    return useContext(VaultContext);
}

export default useVault;