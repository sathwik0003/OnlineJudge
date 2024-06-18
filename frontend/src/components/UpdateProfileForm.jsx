import React from 'react';
import { VStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const UpdateProfileForm = ({ onClose }) => {
  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your name" />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your email" />
      </FormControl>
      <Button colorScheme="blue" onClick={onClose}>Update Profile</Button>
    </VStack>
  );
};

export default UpdateProfileForm;