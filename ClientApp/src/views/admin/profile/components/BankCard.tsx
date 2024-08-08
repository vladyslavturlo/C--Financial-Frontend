// Chakra imports
import { Box, Button, Flex, Icon, Image, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
// Assets
import { MdDelete } from 'react-icons/md';
import Debit from 'assets/img/profile/Debit.png'
import { http } from 'utils/http';
import { useCallback } from 'react'

export default function BankCard(props: {
	institution: string;
	id: string
	accounts: Array<string>;
	onDelete: (id: string) => void
}) {
	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = 'gray.400';
	const bg = useColorModeValue('white', 'navy.700');
	const cardShadow = useColorModeValue(
		'0px 18px 40px rgba(112, 144, 176, 0.12)',
		'unset'
	)
	const { institution, id, accounts, onDelete } = props;

	const { isOpen, onOpen, onClose } = useDisclosure()
	const toast = useToast()
	const handleDelete = useCallback(() => {
		http.post('plaid/unlink', { item_id: id })
			.then(() => {
				onDelete(id)
				toast({
					title: 'Success',
					description: 'Now you account has been unlinked.',
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top-right',
				})
				onClose();
			})
	}, [id])
	return (
		<>
			<Card bg={bg}
				boxShadow={cardShadow} mb="20px" p='14px'>
				<Flex align='center' direction={{ base: 'column', md: 'row' }}>
					<Image h='80px' w='80px' src={Debit} borderRadius='8px' me={{ base: '0', md: '20px' }} />
					<Box mt={{ base: '10px', md: '0' }} textAlign={{ base: 'center', md: 'left' }}>
						<Text color={textColorPrimary} fontWeight='500' fontSize='md' mb='4px'>
							{institution}
						</Text>
						<Text fontWeight='500' color={textColorSecondary} fontSize='sm' me='4px'>
							{accounts.join(' • ')}
						</Text>
					</Box>
					<Link me='16px' ms={{ base: '16px', md: 'auto' }} p='0px !important' onClick={onOpen}>
						<Icon as={MdDelete} color='secondaryGray.500' h='18px' w='18px' />
					</Link>
				</Flex>
			</Card>

			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Are you sure to unlink?
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose} colorScheme='blue' mr={3}>Cancel</Button>
						<Button onClick={handleDelete}>Confirm</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
