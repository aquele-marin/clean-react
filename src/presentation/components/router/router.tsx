import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '@/presentation/pages'
import '../../styles/global.scss'

const Router: React.FC = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={<Login/>}/>
        </Routes>
    </BrowserRouter>
}

export default Router