import axios from "../api/axios";
import useAuth from "./useAuth";
import useVault from "./useVault";

const useLogout = () => {
    const { setAuth } = useAuth();
    const { setVault } = useVault();

    const logout = async () => {
        setAuth({});
        setVault({});
        localStorage.removeItem('vaultKey');
        try {
            await axios('/logout', {
                withCredentials: true
            });
        } catch (err) {
            // console.error(err);
        }
    }

    return logout;
}

export default useLogout;