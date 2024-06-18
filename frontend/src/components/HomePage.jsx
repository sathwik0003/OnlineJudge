// src/pages/Home.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Link,
  VStack,
  Image,
} from '@chakra-ui/react';
import Marquee from 'react-fast-marquee';
import HomeCard from '../components/HomeCard';

const companyLogos = [
  { name: 'Company 1', logo: 'https://example.com/logo1.png', link: 'https://company1.com' },
  { name: 'Company 2', logo: 'https://example.com/logo2.png', link: 'https://company2.com' },
  { name: 'Company 3', logo: 'https://example.com/logo3.png', link: 'https://company3.com' },
  { name: 'Company 4', logo: 'https://example.com/logo4.png', link: 'https://company4.com' },
  { name: 'Company 5', logo: 'https://example.com/logo5.png', link: 'https://company5.com' },
  // Add more company logos here
];

const popularCourses = [
  { title: 'Data Structures', image: 'https://example.com/ds.jpg', link: '/course/data-structures' },
  { title: 'Algorithms', image: 'https://example.com/algo.jpg', link: '/course/algorithms' },
  { title: 'Web Development', image: 'https://example.com/web.jpg', link: '/course/web-dev' },
  { title: 'Machine Learning', image: 'https://example.com/ml.jpg', link: '/course/machine-learning' },
  // Add more courses here
];

const upcomingContests = [
  { name: 'Weekly Challenge', date: '2024-06-25', time: '14:00 UTC', registrationLink: '/register/weekly' },
  { name: 'Monthly Hackathon', date: '2024-07-01', time: '09:00 UTC', registrationLink: '/register/monthly' },
  { name: 'Coding Marathon', date: '2024-07-15', time: '10:00 UTC', registrationLink: '/register/marathon' },
  // Add more upcoming contests
];

const pastContests = [
  { name: 'Spring Coding Sprint', date: '2024-05-15', time: '10:00 UTC', resultsLink: '/results/spring-sprint' },
  { name: 'AI Challenge', date: '2024-04-20', time: '13:00 UTC', resultsLink: '/results/ai-challenge' },
  { name: 'Database Design Contest', date: '2024-03-10', time: '11:00 UTC', resultsLink: '/results/db-design' },
  // Add more past contests
];

const HomePage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome to Online Judge
        </Heading>

        <Box>
          <Marquee speed={50} gradient={false}>
            {companyLogos.map((company, index) => (
              <Link key={index} href={company.link} isExternal mx={4}>
                <Image src={company.logo} alt={company.name} h="50px" objectFit="contain" />
              </Link>
            ))}
          </Marquee>
        </Box>

        <Heading as="h2" size="xl">
          Popular Courses
        </Heading>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
          {popularCourses.map((course, index) => (
            <HomeCard key={index} {...course} />
          ))}
        </SimpleGrid>

        <Heading as="h2" size="xl">
          Upcoming Contests
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Contest Name</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Registration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {upcomingContests.map((contest, index) => (
              <Tr key={index}>
                <Td>{contest.name}</Td>
                <Td>{contest.date}</Td>
                <Td>{contest.time}</Td>
                <Td>
                  <Button as={Link} href={contest.registrationLink} colorScheme="blue" size="sm">
                    Register
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Heading as="h2" size="xl">
          Past Contests
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Contest Name</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Results</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pastContests.map((contest, index) => (
              <Tr key={index}>
                <Td>{contest.name}</Td>
                <Td>{contest.date}</Td>
                <Td>{contest.time}</Td>
                <Td>
                  <Button as={Link} href={contest.resultsLink} colorScheme="green" size="sm">
                    View Results
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default HomePage;