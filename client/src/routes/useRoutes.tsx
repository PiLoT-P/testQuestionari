import Admin from "@src/pages/Admin";
import Client from "@src/pages/Client";
import Join from "@src/components/clientJoin/Join";
import { Route, Routes } from "react-router-dom";
import DashBoard from "@src/pages/DashBoard";

export const useRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Join/>}/>
            <Route path="client" element={<Client/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/dashboard" element={<DashBoard/>}/>
        </Routes>
    );
}