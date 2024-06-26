import React from 'react'
import AllProblems from '@/components/AllProblems'
import Header from '@/components/ui/Header'
import Footer from '@/components/Footer'
import { Box, Container } from '@chakra-ui/react'

const AllProblemsPage = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" flex="1" py={8}>
        <AllProblems />
      </Container>
      <Footer />
    </Box>
  )
}

export default AllProblemsPage