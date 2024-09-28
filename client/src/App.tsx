import aws from "./assets/logoclub.png";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useScanStore } from "./state/scanState";
import { Loader } from "lucide-react";
import {toast} from 'react-hot-toast';
function App() {
    const { scan, setScan,result,checkCSV} = useScanStore();
    if (scan) {
        return (
            <div className="bg-purple-700 w-screen h-screen flex flex-col justify-center items-center">
                <Loader className="w-6 h-6 animate-spin mx-auto text-white" />
                <h1 className="text-white mt-2">Checking Your Ticket...</h1>
            </div>
        );
    }
    return (
        <div className="bg-purple-700 backdrop-blur-md w-screen h-screen">
            <img src={aws} alt="aws cloud nepal" className="w-24 mx-auto p-2" />
            <h1 className=" text-white p-4 text-xl text-center font-semibold font-mono">
                AWS Student Community Day Attendence
            </h1>
            <div className="max-w-lg bg-purple-600 mb-2">
                <Scanner
                    onScan={async (barcodes: IDetectedBarcode[]) => {
                        if (barcodes.length > 0) {
                            setScan(true)
                            await checkCSV(barcodes[0].rawValue)
                            setScan(false)
                        }
                    }}
                    paused={scan}
                    onError={() => {
                        toast.error('Error Scanning Ticket! Try Again');
                    }}
                    formats={["qr_code"]}
                />
            </div>
            {result.name.length>0 && (
                <div className="px-4">
                    <p className="text-white text-xl font-mono">Last Scan:</p>
                    <p className="text-white text-sm font-mono">Name:{result.name}</p>
                    <p className="text-white text-sm font-mono">Email:{result.email}</p>
                    <p className="text-white text-sm font-mono">Time:{new Date(result.time).toLocaleDateString('en-US', { month: 'long', day: 'numeric',hour:'2-digit',minute:'2-digit' })}</p>
                </div>
            )}
        </div>
    );
}

export default App;
