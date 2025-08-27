'use client'
import React from 'react'
import { Pagination as MuiPagination } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiPaginationItem-root': {
      color: '#264D30',
      borderColor: '#264D30',
      fontFamily: 'var(--font-sora)', 
    },
    '& .Mui-selected': {
      backgroundColor: '#264D30',
      color: 'white',
      borderColor: '#264D30',
      '&:hover': {
        backgroundColor: '#264D30',
      },
    },
  },
}))

type PaginationControlProps = {
  totalPages: number
  currentPage: number
  onChange: (value: number) => void
  scrollToRef?: React.RefObject<HTMLDivElement>
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  totalPages,
  currentPage,
  onChange,
  scrollToRef,
}) => {
  const classes = useStyles()

  return (
    <div className={`py-20 ${sora.variable}`}> {/* ✅ применяем переменную */}
      <MuiPagination
        count={totalPages}
        page={currentPage + 1}
        onChange={(_, value) => {
          onChange(value - 1)
          scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }}
        variant="outlined"
        size="large"
        shape="rounded"
        className={classes.root}
      />
    </div>
  )
}

export default PaginationControl
