import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IScanStore } from "../types/scan-types";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;
export const useScanStore = create<IScanStore>((set) => ({
    scan: false,
    result: {
        name: "",
        email: "",
        time: new Date(),
    },
    setScan: (scan: boolean) => set({ scan }),
    checkCSV: async (csv: string) => {
        try {
            const [nameStr, emailStr] = csv.split(",");
            const name = nameStr.trim();
            const email = emailStr.trim();
            const response = await axios.post(
                `${API_URL}/check_attendance`,
                {
                    name,
                    email,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            set({
                result: {
                    name: name,
                    email: email,
                    time: response.data.Time,
                },
            });
            toast.success(`Ticket Found for ${email}`);
        } catch (error) {
            toast.error("Ticket Not Found");
            set({
                result: {
                    name: "",
                    email: "",
                    time: new Date(),
                },
            });
        }
    },
}));
