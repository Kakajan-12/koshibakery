'use client'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

interface ReduxWrapperProps {
  children: ReactNode
}

const ReduxWrapper: React.FC<ReduxWrapperProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxWrapper
