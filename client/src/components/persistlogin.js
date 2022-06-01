import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useVault from "../hooks/useVault";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const { setVault } = useVault();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                // console.error(err);
                setVault({});
                localStorage.removeItem('vaultKey');
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`);
    //     console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    // },[isLoading])

    return (
        <>
            {
                isLoading
                ? <p>Loading...</p>
                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;