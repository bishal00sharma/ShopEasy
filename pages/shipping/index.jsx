import { Box, Button, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import styles from "../../styles/Home.module.css";
import { GoLocation } from 'react-icons/go';
import { BsBoxSeam } from 'react-icons/bs';
import Address from "./Address";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';


export default function Shipping(){
  const [cart,setCart] = useState([]);
  const [ discountTotal, setDiscountTotal] = useState(0);
  const [ total, setTotal] = useState(0);
  const router = useRouter()


  // async function getDatas(val){
   
  //  let data=await axios.get(`http://localhost:3000/api/products/category?findbyid=${val._id}`)
  //  console.log(data)
  //    setCart(data.data.data)
  // }

  async function getDatas(arr){
    let ans = [];
    let totalPrice = 0;
    let discount =0;
    for(let i=0;i<arr.length;i++){
        let {productid} = arr[i]
        let data=await axios.get(`http://localhost:3000/api/products/category?findbyid=${productid}`)
        totalPrice=totalPrice+ Number(data.data.data.price)||0; 
        discount=discount+ Number(data.data.data.discount_price)||0; 
       ans.push(data.data.data)
    }
    setCart(ans);
    setTotal(totalPrice)
    setDiscountTotal(discount)

    
}

  async function cartData(){

    const val = localStorage.getItem("userID");

    let dataa = await fetch(`http://localhost:3000/api/cart`, {
        method: 'GET',
        headers : {userId : val,"Content-type": "application/json;charset=UTF-8" } 
    })  

    let res= await dataa.json()   
    getDatas(res)
  }

  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;
  
      script.onload = () => {
        resovle(true);
      };
  
      script.onerror = () => {
        resovle(false);
      };
  
      document.body.appendChild(script);
    });
  };
  
  const displayRazorpay = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
  
    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }
  
    const options = {
      key: "rzp_test_hKJK0hoBo6mCYQ",
      currency: "INR",
      amount: amount * 100,
      name: "ShopEasy",
      description: "Thanks for purchasing",
      image:
        "http://localhost:3000/shopeeasy-logo.png",
  
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert("Payment Successfully");
      },
      prefill: {
        name: "Shopeasy",
      },
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  

  useEffect(() => {
    cartData()
    let val=""
    if (localStorage) {
        const tokendata = localStorage.getItem("token");
        val = JSON.parse(tokendata)
       }
      
  }, []);

    return (
      <Box>
         <Flex h="40%" w="80%" m="auto">
                <Image w="20%" h="40%" src="/shopeeasy-logo.png" />
                <Image ml="30" w="45%" src="/deliveryImg.png"/>
            </Flex>
        <Flex justifyContent="space-evenly" w="80%" m="auto" mb="20" mt="20">
            <hr p="10" />
           <Box w="65%">
             <Flex>
              <GoLocation fontSize="30" />
              <Box>
                <Text p="1" fontWeight="650" fontSize="20">Delivery Address</Text>
                <Text>We will deliver your order to this address</Text>
              </Box>
            </Flex>
            <Address />
           </Box>
           <Box w="25%" border="1px dashed gray" px="5" py="2">
                 <Text fontWeight="700" my="2">Order Details</Text>
                 <Flex justifyContent="space-between">
                    <Text>Bag total</Text>
                    <Text>₹{discountTotal}</Text>
                 </Flex>
                 <Flex justifyContent="space-between">
                    <Text>Bag discount</Text>
                    <Text>₹{total-discountTotal}</Text>
                 </Flex>
               
                <Flex justifyContent="space-between" my="3" >
                    <Box color="gray">Delivery Fee</Box>
                    <Flex>
                    <Box>Free</Box>
                    <Box textDecoration="line-through">₹99.00</Box>
                    </Flex>
                </Flex> 
                <Flex justifyContent="space-between">
                    <Text fontWeight="700">Total Amount</Text>
                    <Text fontWeight="700">₹ {discountTotal}</Text>
                 </Flex>


                 <Button onClick={()=>displayRazorpay(discountTotal)} className={styles.singleProductAddtoCart} w="full" mt="5" bgColor="orange.400" color="white">Proceed to Payment</Button>

                 </Box>
        </Flex>
        <hr />
        <Box w="50%" ml="60" mt="10">
          <Flex>
            <Text fontSize="33" mt="1" mr="5">
              <BsBoxSeam />
            </Text>
            <Text fontSize="25" mb="10">  Your items</Text>
          </Flex>
          
        <SimpleGrid columns={4} spacing={10}>
          {
            cart.map((item)=>(
              <Box>
              <Image w="24" src={item.image} />
              <Box>
                <Text ml="3" fontSize="17">{item.name} </Text>
                <Text color="orange" ml="3">{item.brand} </Text>
              </Box>
              </Box>
            )) 
          }
          
            
              
              
           
      
          </SimpleGrid>
        </Box>
        <Image mt="20" src="/footerImg.png" alt="footerImg"/>
        </Box>
    )
}