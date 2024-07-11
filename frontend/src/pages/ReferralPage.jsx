import React from 'react'
import Referral from '@/components/Referral'
import Footer from '@/components/Footer';
import Header from '@/components/ui/Header';
import { Box,Container } from '@chakra-ui/react';

const ReferralPage = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="container.xl" flex="1" py={8}>
        <Referral />
      </Container>
      <Footer />
    </Box>
  )
}

export default ReferralPage