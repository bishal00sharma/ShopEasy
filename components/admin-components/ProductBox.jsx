import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AddProducts from "./AddProducts";
import TableBody from "./TableBody";

export default function ProductBox() {
  let sr = 1;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allProductData, setAllProductData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [a, setA] = useState(1);
  const [loading, setLoading] = useState(false);

  const trimProductArray = (page) => {
    let trimmedArr = allProductData.filter((item, index) => {
      if (index >= 10 * (page - 1) && index < 10 * page) {
        return item;
      }
    });
    setProductData(trimmedArr);
  };

  const getProductData = async () => {
    let res = await axios.get(
      "http://localhost:3000/api/products/category?price=10&cmd=gte"
    );
    // console.log(res.data);
    setAllProductData(res.data);
  };

  useEffect(() => {
    const getProductData = async () => {
      let res = await axios.get(
        "http://localhost:3000/api/products/category?price=10&cmd=gte"
      );
      // console.log(res.data);
      setAllProductData(res.data);
    };
    getProductData();
  }, [a]);

  useEffect(() => {
    const trimProductArray = (page) => {
      let trimmedArr = allProductData.filter((item, index) => {
        if (index >= 10 * (page - 1) && index < 10 * page) {
          return item;
        }
      });
      setProductData(trimmedArr);
    };
    trimProductArray(page);
  }, [allProductData, page]);

  if (allProductData.length === 0) {
    return (
      <Flex w="100%" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }
  return (
    <Box padding="2rem" width="100%">
      {isOpen && (
        <AddProducts
          setA={setA}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setLoading={setLoading}
        />
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Heading>Products</Heading>
        </Box>
        <Box
        >
          <Button
            onClick={onOpen}
            isLoading={loading}
            colorScheme="green"
            padding="1.5rem 2rem"
          >
            Add Products
          </Button>
        </Box>
      </Flex>
      <TableContainer mt="5rem">
        <Table textAlign="center" variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th fontSize="1.1rem">S. no.</Th>
              <Th fontSize="1.1rem">Product Name</Th>
              <Th fontSize="1.1rem">Image</Th>
              <Th fontSize="1.1rem">Price</Th>
              <Th fontSize="1.1rem">Category</Th>
              <Th fontSize="1.1rem">Edit</Th>
              <Th fontSize="1.1rem">Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allProductData.map((item) => (
              <TableBody key={item._id} setA={setA} item={item} sr={sr++} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt="2rem">
        <Flex justifyContent="center" alignItems="center">
          <Button
            colorScheme="green"
            size="lg"
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Prev
          </Button>
          <Text fontSize="2rem" fontWeight="bold" marginInline="1rem">
            {page}
          </Text>
          <Button
            colorScheme="green"
            size="lg"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}


