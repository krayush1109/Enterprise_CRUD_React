import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React from 'react'

interface Props{
    children: React.ReactNode;
}

const MainLayout = ({children}: Props) => {
  return (
      <>
        <AppBar position="static">
              <Toolbar>
                  <Typography variant='h6'>
                      Enterprise CRUD App
                  </Typography>
              </Toolbar>
          </AppBar>
          
          <Container sx={{margin: 4}}>
                {children}
          </Container>
      
      </>
  )
}

export default MainLayout