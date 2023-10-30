import { Button, Paper, Typography } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import React from 'react'


const PageNotFound = () => {


  return (
      <Paper
        sx={{
          backgroundColor: (t) => t.palette.background.default,
          margin: 0,
          height: `calc(100vh - 64px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: `100%`,
          }}
        >
          <Typography variant="h6" color="secondary">
            Page not found
            </Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>
            404
            </Typography>
          <Typography variant="subtitle1">
          </Typography>
          <Button
            color="secondary"
            aria-label="home"
            href="/"
            sx={{ mt: 2 }}
          >
            <HomeRoundedIcon />
          </Button>
        </div>
      </Paper>
  )
}

export default PageNotFound