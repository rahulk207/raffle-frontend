import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function EnterRaffle() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex, 16)
    const [raffleAddress, setRaffleAddress] = useState()
    const [numPlayers, setNumPlayers] = useState()
    const [recentWinner, setRecentWinner] = useState()

    useEffect(() => {
        if (chainId) {
            console.log(chainId in contractAddresses)
            setRaffleAddress(chainId in contractAddresses ? contractAddresses[chainId][0] : null)
        }
    }, [chainId])

    const [entranceFee, setEntranceFee] = useState()

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromContract = (
            await getEntranceFee({ onError: (error) => console.log(error) })
        ).toString()
        const numPlayersfromContract = (
            await getNumPlayers({ onError: (error) => console.log(error) })
        ).toString()
        const recentWinnerfromContract = (
            await getRecentWinner({ onError: (error) => console.log(error) })
        ).toString()

        setEntranceFee(entranceFeeFromContract)
        setNumPlayers(numPlayersfromContract)
        setRecentWinner(recentWinnerfromContract)
    }

    useEffect(() => {
        if (raffleAddress) {
            updateUI()
        }
    }, [raffleAddress])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isFetching || isLoading}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                    <div>
                        Raffle Entrance Fee:{" "}
                        {entranceFee ? ethers.utils.formatUnits(entranceFee, "ether") : ""} ETH
                    </div>
                    <div>The current number of players is: {numPlayers ? numPlayers : ""}</div>
                    <div>The most previous winner was: {recentWinner ? recentWinner : ""}</div>
                </div>
            ) : (
                <div>No Raffle Detected!</div>
            )}
        </div>
    )
}
