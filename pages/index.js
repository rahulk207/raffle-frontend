import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import EnterRaffle from "../components/EnterRaffle"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Decentralised Raffle</title>
                <meta name="description" content="Decentralised Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ManualHeader /> */}
            <Header />
            <EnterRaffle />
        </div>
    )
}
