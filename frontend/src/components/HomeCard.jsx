import React from 'react';
import { Box, Image, Text, LinkBox, LinkOverlay, Flex, Badge } from '@chakra-ui/react';

const HomeCard = ({ title, image, link, category, duration, level }) => {
  return (
    <LinkBox 
      as="article" 
      maxW="sm" 
      rounded="lg" 
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Box position="relative">
        <Image src={image} alt={title} w="100%" h="200px" objectFit="cover" />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.3)"
          p="4"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <LinkOverlay href={link}>
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              color="white" 
              mb="2"
              noOfLines={2}
            >
              {title}
            </Text>
          </LinkOverlay>
          <Flex justify="space-between" align="center">
            <Badge colorScheme="green" fontSize="0.8em" fontWeight="bold">
              {category}
            </Badge>
            <Text color="gray.300" fontSize="sm">
              {duration} • {level}
            </Text>
          </Flex>
        </Box>
      </Box>
    </LinkBox>
  );
};

export default HomeCard;