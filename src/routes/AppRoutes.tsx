import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeesPage from "../features/employess/pages/EmployeesPage";
import MainLayout from "../layouts/MainLayout";


export default function AppRoutes() {
    
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<EmployeesPage />} ></Route>
                </Routes>            
            </MainLayout>
        </BrowserRouter>
    )


}