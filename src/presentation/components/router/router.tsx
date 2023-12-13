import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

type Props = {
    makeLogin: React.FC
}

const Router: React.FC<Props> = ({ makeLogin }: Props) => {
    // const NewLogin = makeLogin({});
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={makeLogin({})}/>
        </Routes>
    </BrowserRouter>
}

export default Router