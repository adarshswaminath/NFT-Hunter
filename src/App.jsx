import React,{ Component } from "react"
import { Network, Alchemy } from "alchemy-sdk"
import { useEffect, useState } from "react"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEthereum } from "@fortawesome/free-brands-svg-icons"
// Components
import Navbar from "./Navbar"
import Alert from "./Alert"

export default function App() {
  // State for store address  
  const [address, setAddress] = useState('');
  // State for count NFT
  const [nftCountMessage, setNftCount] = useState('');
  // State for Store nft detils 
  const [nfts, setNfts] = useState([]);
  // State for error message
  const [error,setError] = useState()


  async function nftFinder() {
    try{
      const alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET
    });

    if(address.length != 0){
      const nftData = await alchemy.nft.getNftsForOwner(address);
      setNftCount(`Total NFT #${nftData.totalCount}`);
      for await (const nft of alchemy.nft.getNftsForOwnerIterator(address)) {
        const img = nft.media[0].thumbnail; // Image
        const floorPrice = nft.contract.openSea.floorPrice; // floor price
        const name = nft.contract.name; // NFT name 
        const RequestStatus = nft.contract.openSea.safelistRequestStatus; // NFT safe request status
        setNfts(prevNfts => [...prevNfts, { img, floorPrice, name,RequestStatus }]); // push State which store NFT detils
      }
    } 
    else {
      setError("Empty Space Not acceptable")
    }
      // Error message 
      } catch(err) {
        setError("Something Went Wrong Reload The Page And Try again ....")
      }
  }
  return (
    <div className="App">
      <Alert/>
      <Navbar />
      <div className="flex justify-center items-center p-8">
        <input type="text" className='px-3 py-2 shadow border rounded w-60 lg:w-full' placeholder='Enter address or ENS' onChange={(e) => setAddress(e.target.value)} />
        <button className='px-2 py-2 ml-2 text-white hover:text-blue-600' onClick={nftFinder}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {/* display number of NFT owned by address */}
      <div className="grid items-center justify-center">
        <span className="text-xl text-white">{error}</span>
        <span className="text-xl text-white">{nftCountMessage}</span>
      </div>

      {/* display images */}
      <div className="text-center items-center justify-center m-auto">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-4 md:gap-4">
          // Fetch data from the State Which Store NFT detils
          {nfts.filter((a) => a).map((nft, index) => (
            <div className="card card-compact border-2 border-blue-700 w-45 sm:w-80 bg-base-100 shadow-xl relative group">
              <img src={nft.img} alt={nft.img} key={nft.img}/>
              <div className="card-body">
                <h6 className="card-title text-sm grid sm:flex md:flex">
                  Safe Request Status 
                  <div className={
                    nft.RequestStatus === "verified" ? "badge badge-success" 
                  : nft.RequestStatus === "not_requested" ? "badge badge-error" 
                  : "badge badge-info"}>{nft.RequestStatus}</div>
                </h6>
                <div className="card-title">{nft.name}</div>
                <div className="card-actions justify-end grid">
                  <div className="badge text-white">Floor Price</div>
                  <div className="badge text-white">{nft.floorPrice}
                    <FontAwesomeIcon className="ml-2" icon={faEthereum} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
