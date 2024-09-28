export interface IScanStore {
    scan: boolean;
    setScan: (scan: boolean) => void;
    result:{
        name: string;
        email: string;
        time:Date;
    }
    checkCSV:Function;
}