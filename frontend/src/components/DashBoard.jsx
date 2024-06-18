import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  SimpleGrid,
  Wrap,
  WrapItem,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { FaChevronRight, FaFire } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your form components here
import UpdateProfileForm from './UpdateProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';

const Dashboard = () => {
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isSubmissionsOpen, onOpen: onSubmissionsOpen, onClose: onSubmissionsClose } = useDisclosure();
  const [activeForm, setActiveForm] = useState(null);

  // Mock data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const submissions = [
    { id: 1, problem: 'Two Sum', date: '2024-06-15', status: 'Accepted' },
    { id: 2, problem: 'Reverse String', date: '2024-06-14', status: 'Wrong Answer' },
    { id: 3, problem: 'Fizz Buzz', date: '2024-06-13', status: 'Accepted' },
    { id: 4, problem: 'Valid Parentheses', date: '2024-06-12', status: 'Time Limit Exceeded' },
    { id: 5, problem: 'Merge Two Sorted Lists', date: '2024-06-11', status: 'Accepted' },
  ];

  const streakData = [
    { date: '2024-06-18', count: 1 },
    { date: '2024-06-17', count: 1 },
    { date: '2024-06-16', count: 0 },
    { date: '2024-06-15', count: 1 },
    // Add more data here
  ];

  const currentStreak = 2;
  const maxStreak = 7;

  const progressData = [
    { name: 'Solved', value: 65 },
    { name: 'Unsolved', value: 35 },
  ];

  const monthlyData = [
    { name: 'Jan', problems: 30 },
    { name: 'Feb', problems: 45 },
    { name: 'Mar', problems: 38 },
    { name: 'Apr', problems: 50 },
    { name: 'May', problems: 42 },
    { name: 'Jun', problems: 55 },
  ];

  const topicWiseSolutions = [
    { topic: 'Arrays', solved: 20, total: 30 },
    { topic: 'Strings', solved: 15, total: 25 },
    { topic: 'Dynamic Programming', solved: 10, total: 40 },
    { topic: 'Trees', solved: 12, total: 20 },
    { topic: 'Graphs', solved: 8, total: 15 },
  ];

  const getColor = (value) => {
    if (!value) {
      return 'color-empty';
    }
    return `color-scale-${value.count}`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleSettingClick = (formType) => {
    setActiveForm(formType);
    onSettingsOpen();
  };

  const handleFormSubmit = (formType) => {
    onSettingsClose();
    toast.success(`${formType} updated successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <Box p={4} bg="gray.50" minHeight="100vh">
      <ToastContainer />
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <VStack align="stretch" spacing={8}>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Flex align="center" justify="space-between" wrap="wrap">
              <HStack spacing={4} mb={{ base: 4, md: 0 }}>
                <Avatar name={user.name} bg="teal.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">{user.name}</Text>
                  <Text color="gray.600">{user.email}</Text>
                </VStack>
              </HStack>
              <Wrap spacing={2} justify="flex-end">
                <WrapItem>
                  <Button size="sm" colorScheme="teal" onClick={() => handleSettingClick('profile')}>Update Profile</Button>
                </WrapItem>
                <WrapItem>
                  <Button size="sm" colorScheme="blue" onClick={() => handleSettingClick('password')}>Change Password</Button>
                </WrapItem>
                <WrapItem>
                  <Button size="sm" colorScheme="red" onClick={() => handleSettingClick('delete')}>Delete Account</Button>
                </WrapItem>
              </Wrap>
            </Flex>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Last 5 Submissions</Text>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Problem</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {submissions.map((sub) => (
                    <Tr key={sub.id}>
                      <Td>{sub.problem}</Td>
                      <Td>{sub.date}</Td>
                      <Td>
                        <Text
                          color={sub.status === 'Accepted' ? 'green.500' : 'red.500'}
                          fontWeight="bold"
                        >
                          {sub.status}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Button
              rightIcon={<FaChevronRight />}
              colorScheme="blue"
              variant="link"
              mt={4}
              onClick={onSubmissionsOpen}
            >
              View All Submissions
            </Button>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Problem Solving Progress</Text>
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
              <Box width={{ base: "100%", md: "200px" }} height="200px" mb={{ base: 4, md: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <VStack align="stretch" flex={1} ml={{ md: 4 }}>
                <Text>Total Progress: 65%</Text>
                <Progress value={65} size="lg" colorScheme="green" />
                <HStack justify="space-between">
                  <Text>Solved: 65</Text>
                  <Text>Total: 100</Text>
                </HStack>
              </VStack>
            </Flex>
          </Box>
        </VStack>

        <VStack align="stretch" spacing={8}>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Problem Solving Streak</Text>
            <CalendarHeatmap
              startDate={new Date('2024-01-01')}
              endDate={new Date('2024-12-31')}
              values={streakData}
              classForValue={getColor}
            />
            <StatGroup mt={4}>
              <Stat>
                <StatLabel>Current Streak</StatLabel>
                <StatNumber>{currentStreak} days <FaFire color="orange" /></StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Max Streak</StatLabel>
                <StatNumber>{maxStreak} days</StatNumber>
              </Stat>
            </StatGroup>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Monthly Problem Solving</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="problems" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Topic-wise Solutions</Text>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Topic</Th>
                    <Th isNumeric>Solved</Th>
                    <Th isNumeric>Total</Th>
                    <Th isNumeric>Progress</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topicWiseSolutions.map((topic, index) => (
                    <Tr key={index}>
                      <Td>{topic.topic}</Td>
                      <Td isNumeric>{topic.solved}</Td>
                      <Td isNumeric>{topic.total}</Td>
                      <Td isNumeric>
                        <Progress value={(topic.solved / topic.total) * 100} size="sm" colorScheme="green" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </SimpleGrid>

      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {activeForm === 'profile' && 'Update Profile'}
            {activeForm === 'password' && 'Change Password'}
            {activeForm === 'delete' && 'Delete Account'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activeForm === 'profile' && <UpdateProfileForm onSubmit={() => handleFormSubmit('Profile')} />}
            {activeForm === 'password' && <ChangePasswordForm onSubmit={() => handleFormSubmit('Password')} />}
            {activeForm === 'delete' && <DeleteAccountForm onSubmit={() => handleFormSubmit('Account')} />}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSubmissionsOpen} onClose={onSubmissionsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Submissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Problem</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {submissions.map((sub) => (
                  <Tr key={sub.id}>
                    <Td>{sub.problem}</Td>
                    <Td>{sub.date}</Td>
                    <Td>
                      <Text
                        color={sub.status === 'Accepted' ? 'green.500' : 'red.500'}
                        fontWeight="bold"
                      >
                        {sub.status}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;