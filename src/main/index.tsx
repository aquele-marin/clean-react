import React from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'
import { makeLogin } from './factories/pages/login/login-factory'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <Router 
        makeLogin={makeLogin} 
    />
)