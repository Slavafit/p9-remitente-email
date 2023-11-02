import { Button, Paper, Typography } from '@mui/material'
import React from 'react'
import notFoundImage from './assets/404.png'

const PageNotFound = () => {


  return (

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: `100%`,
          }}
        >
          <Button
            aria-label="home"
            href="/"
            sx={{ mt: 2 }}
          >
            <img src={notFoundImage} alt="404 Image"/>
          </Button>
        </div>

  )
}

export default PageNotFound