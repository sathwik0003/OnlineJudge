import React from 'react';
import {
  Box,
  Container,
  Heading,
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
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import Marquee from 'react-fast-marquee';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import G_logo from '../assets/google_logo.jpeg'
import Micro_logo from '../assets/microsoft_logo.jpeg'
import Meta_logo from '../assets/meta_logo.jpeg'
import Amazon_logo from '../assets/amazon_logo.jpeg'
import Netflix_logo from '../assets/netflix_logo.jpeg'
import flipkart_logo from '../assets/flipkart_logo.jpeg'
import walmart_logo from '../assets/walmart_logo.jpeg'
import uber_logo from '../assets/uber_logo.jpeg'
import Homeback1 from '../assets/home_back1.jpeg'
import Homeback2 from '../assets/home_back2.jpeg'
import Homeback3 from '../assets/home_back3.jpeg'
import Homeback4 from '../assets/home_back4.jpeg'

const popularCourses = [
  { title: 'Data Structures', image: Homeback1, link: '/course/data-structures', icon: '🏗️' },
  { title: 'Algorithms', image: Homeback2, link: '/course/algorithms', icon: '🧮' },
  { title: 'Web Development', image: Homeback3, link: '/course/web-dev', icon: '🌐' },
  { title: 'Machine Learning', image: Homeback4, link: '/course/machine-learning', icon: '🤖' },
  // Add more courses as needed
];
const companyLogos = [
  { name: 'Company 1', logo: G_logo, link: 'https://company1.com' },
  { name: 'Company 2', logo: Micro_logo, link: 'https://company2.com' },
  { name: 'Company 3', logo: Meta_logo, link: 'https://company3.com' },
  { name: 'Company 4', logo: Amazon_logo, link: 'https://company4.com' },
  { name: 'Company 5', logo: Netflix_logo, link: 'https://company5.com' },
  { name: 'Company 6', logo: flipkart_logo, link: 'https://company6.com' },
  { name: 'Company 7', logo: walmart_logo, link: 'https://company7.com' },
  { name: 'Company 8', logo: uber_logo, link: 'https://company8.com' },
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
      <VStack spacing={12} align="stretch">
        <Box as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Popular Courses 📚
          </Heading>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            centerMode={true}
            centerSlidePercentage={33.33}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <Button position="absolute" left={0} top="50%" zIndex={2} onClick={onClickHandler} aria-label={label}>
                  <Icon as={FaChevronLeft} />
                </Button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <Button position="absolute" right={0} top="50%" zIndex={2} onClick={onClickHandler} aria-label={label}>
                  <Icon as={FaChevronRight} />
                </Button>
              )
            }
          >
            {popularCourses.map((course, index) => (
              <Box key={index} p={4} height="300px">
                <Link href={course.link}>
                  <VStack spacing={4} bg="gray.100" borderRadius="md" p={4} height="100%" justifyContent="center">
                    <Text fontSize="5xl">{course.icon}</Text>
                    <Image src={course.image} alt={course.title} height="150px" objectFit="cover" borderRadius="md" />
                    <Heading as="h3" size="md" textAlign="center">
                      {course.title}
                    </Heading>
                  </VStack>
                </Link>
              </Box>
            ))}
          </Carousel>
        </Box>

        <Box as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Popular Companies 🤝
          </Heading>
          <Marquee speed={50} gradient={false}>
            {companyLogos.map((company, index) => (
              <Link key={index} href={company.link} isExternal mx={4}>
                <Image src={company.logo} alt={company.name} h="50px" objectFit="contain" />
              </Link>
            ))}
          </Marquee>
        </Box>

        <Box as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Upcoming Contests 🏆
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
                  <Td>
                    <Flex align="center">
                      <Icon as={FaTrophy} mr={2} color="yellow.500" />
                      {contest.name}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaCalendarAlt} mr={2} />
                      {contest.date}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaClock} mr={2} />
                      {contest.time}
                    </Flex>
                  </Td>
                  <Td>
                    <Button as={Link} href={contest.registrationLink} colorScheme="blue" size="sm">
                      Register
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            Past Contests 🏅
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
                  <Td>
                    <Flex align="center">
                      <Icon as={FaTrophy} mr={2} color="gray.500" />
                      {contest.name}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaCalendarAlt} mr={2} />
                      {contest.date}
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaClock} mr={2} />
                      {contest.time}
                    </Flex>
                  </Td>
                  <Td>
                    <Button as={Link} href={contest.resultsLink} colorScheme="green" size="sm">
                      View Results
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;