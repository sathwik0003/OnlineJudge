import React, { useEffect, useState } from 'react';
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
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { FaChevronRight, FaFire } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import UpdateProfileForm from './UpdateProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';

const Dashboard = () => {
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isSubmissionsOpen, onOpen: onSubmissionsOpen, onClose: onSubmissionsClose } = useDisclosure();
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState({ username: '', email: '' });
  const [submissions, setSubmissions] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topicWiseSolutions, setTopicWiseSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allSubmissions, setAllSubmissions] = useState([]);


  const bgColor = useColorModeValue('white', 'gray.800');
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [userDetails, stats, monthlyStats, topicStats] = await Promise.all([
          fetch('http://localhost:2999/userdetails', { headers: { 'Authorization': `Bearer ${authToken}` } }).then(res => res.json()),
          fetch('http://localhost:3000/user/statistics', { headers: { 'Authorization': `Bearer ${authToken}` } }).then(res => res.json()),
          fetch('http://localhost:3000/user/monthly-stats', { headers: { 'Authorization': `Bearer ${authToken}` } }).then(res => res.json()),
          fetch('http://localhost:3000/user/topic-stats', { headers: { 'Authorization': `Bearer ${authToken}` } }).then(res => res.json())
        ]);

        setUser(userDetails);
        setSubmissions(stats.submissions);
        setCurrentStreak(stats.currentStreak);
        setMaxStreak(stats.maxStreak);
        setStreakData(stats.streakData);
        setProgressData([
          { name: 'Solved', value: stats.solvedProblems },
          { name: 'Unsolved', value: stats.totalProblems - stats.solvedProblems }
        ]);
        
        // Format monthly data for the chart
        const formattedMonthlyData = monthlyStats.monthlyData.map(item => ({
          name: item.month,
          problems: item.uniqueProblemCount
        }));
        setMonthlyData(formattedMonthlyData);
        
        setTopicWiseSolutions(topicStats.topicStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken) {
      fetchDashboardData();
    }
  }, [authToken]);

  const handleSettingClick = (formType) => {
    setActiveForm(formType);
    onSettingsOpen();
  };

  const handleFormSubmit = async (formType, formData) => {
    try {
      let response;
      switch (formType) {
        case 'profile':
          response = await fetch('http://localhost:2999/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
          });
          break;
        case 'password':
          response = await fetch('http://localhost:2999/user/change-password', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
          });
          break;
        case 'delete':
          response = await fetch('http://localhost:2999/user/account', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          break;
        default:
          throw new Error('Invalid form type');
      }

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      onSettingsClose();
      toast.success(`${formType} updated successfully!`);
      
      if (formType === 'profile') {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
      } else if (formType === 'delete') {
        // Handle account deletion (e.g., logout and redirect)
      }
    } catch (error) {
      console.error('Error updating:', error);
      toast.error(`Failed to update ${formType}: ${error.message}`);
    }
  };

  const getColor = (value) => {
    if (!value) {
      return 'color-empty';
    }
    return `color-scale-${value.count}`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleViewAllSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/all-submissions', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setAllSubmissions(data.submissions);
        onSubmissionsOpen();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      toast.error('Failed to fetch all submissions');
    }
  };

  return (
    <Box p={4} bg={bgColor} minHeight="100vh">
      <ToastContainer />
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <VStack align="stretch" spacing={8}>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Flex align="center" justify="space-between" wrap="wrap">
              <HStack spacing={4} mb={{ base: 4, md: 0 }}>
                <Avatar name={user.username} bg="teal.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold">{user.username}</Text>
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

          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
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
                    <Tr key={sub._id}>
                      <Td>{sub.problem.title}</Td>
                      <Td>{new Date(sub.submittedAt).toLocaleDateString()}</Td>
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
      onClick={handleViewAllSubmissions}
    >
      View All Submissions
    </Button>
          </Box>

          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
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
                <Text>Total Progress: {((progressData[0].value / (progressData[0].value + progressData[1].value)) * 100).toFixed(2)}%</Text>
                <Progress value={(progressData[0].value / (progressData[0].value + progressData[1].value)) * 100} size="lg" colorScheme="green" />
                <HStack justify="space-between">
                  <Text>Solved: {progressData[0].value}</Text>
                  <Text>Total: {progressData[0].value + progressData[1].value}</Text>
                </HStack>
              </VStack>
            </Flex>
          </Box>
        </VStack>

        <VStack align="stretch" spacing={8}>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Problem Solving Streak</Text>
            <CalendarHeatmap
              startDate={new Date(new Date().getFullYear(), 0, 1)}
              endDate={new Date(new Date().getFullYear(), 11, 31)}
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

          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Monthly Problem Solving</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="problems" fill="#8884d8" name="Problems Solved" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
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
                      <Td>{topic._id}</Td>
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
      {activeForm === 'profile' && <UpdateProfileForm onSubmit={(data) => handleFormSubmit('profile', data)} initialData={user} />}
      {activeForm === 'password' && <ChangePasswordForm onSubmit={(data) => handleFormSubmit('password', data)} />}
      {activeForm === 'delete' && <DeleteAccountForm onSubmit={() => handleFormSubmit('delete')} />}
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
          {allSubmissions.map((sub) => (
            <Tr key={sub._id}>
              <Td>{sub.problem.title}</Td>
              <Td>{new Date(sub.submittedAt).toLocaleDateString()}</Td>
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