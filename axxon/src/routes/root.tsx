import { Outlet } from "@tanstack/react-router";

export function RootLayout() {
    return(
        <div>
            <nav>AXXON!</nav>
            <Outlet/>
            <footer>Global Footer</footer>
        </div>
    );
}