import { Link } from "react-router-dom";


function NFTTile(props) {
  const { data } = props;
  const newTo = {
    pathname: "/nftPage/" + data.tokenId
  };
  
  return (
    <Link
    to={newTo} className="block w-full max-w-xs mx-auto mb-8 bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden relative" style={{ marginLeft: "1px" }} >
    <div className="relative" >
      <img className="h-64 w-full object-cover" src={data.image} alt={data.name} />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25 rounded-lg"></div>
      <div className="absolute bottom-0 left-0 w-full flex flex-col justify-end px-4 py-2 bg-gray-100 opacity-75  hover:bg-black  transition-colors duration-100 overflow-y-auto">
        <h3 className="text-gray-700 uppercase mb-2 hover:text-white">{data.name}</h3>
        <span className="text-gray-500 hover:text-white">${data.price}</span>
        <p className="text-gray-600 mb-4 hover:text-white">{data.description}</p>
      </div>
      <span className="absolute top-0 right-0 bg-yellow-500 bg-opacity-75 text-white font-bold py-2 px-4 rounded-bl">{data.price}</span>
    </div>
  </Link>
  );
}

export default NFTTile;
