import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "../HeaderBar";
import { LanguageBar } from "../LanguageBar";
import TextField from '@mui/material/TextField';
import { Alert, Button, Snackbar } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Autocomplete from '@mui/material/Autocomplete';
import { editReport, getCurrentReports, insertReport } from "../../../services/reportService";
import { getUnverifiedRequests, setVerifyRequests } from "../../../services/requestService";

const disasterReports = [
    { reportID: "id_1", reportName: 'report_1' },
    { reportID: "id_2", reportName: 'report_2' },
    { reportID: "id_3", reportName: 'report_3' }
];

export const EditReport = () => {

    const [open, setOpen] = useState(false);
    const [newReports, setNewReports] = useState('');
    const [reports, setReports] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedInputReport, setSelectedInputReport] = useState();
    const [snackMessage, setSnackMessage] = useState({ message: "", severity: "" });
    const [numOfRequests, setNumOfRequests] = useState(0);
    const [disable, setDisable] = useState(false);
    const [sync, setSync] = useState(false);

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedInputReport((prevDetails) => ({ ...prevDetails, [name]: value }));
    }

    const handleRequests = async (date) => {
        const getRequests = async () => {
            const requests = await getUnverifiedRequests();
            console.log("requests: ", requests);
            const today = new Date();

            if (requests != null) {
                const filteredRequests = requests
                    .filter(request => (request.disasterType == selectedInputReport.disasterType) && (request.disasterLocation == selectedInputReport.disasterLocation))
                    .map(request => request.requestID);

                console.log("filtered requests: ", filteredRequests);

                return filteredRequests;
            } else {
                return 0;
            }
        }
        if (selectedInputReport.disasterType != null && selectedInputReport.disasterLocation != null) {
            setDisable(true);
            setSync(true);
            const newRequests = await getRequests(date);
            let requests = selectedInputReport.disasterRequests;
            if(newRequests != 0){
                requests = [...selectedInputReport.disasterRequests, ...newRequests];
            }
            console.log("AllRequests: ", requests);
            setNumOfRequests(selectedInputReport.disasterRequests.length + newRequests.length);
            setSelectedInputReport((prevDetails) => ({ ...prevDetails, ["disasterRequests"]: requests }));

            setSync(false);

            if (requests.length == 0) {
                const message = { message: "No current requests!", severity: "error" };
                setSnackMessage(message);
            }
            console.log("Sync success");
        } else {
            const message = { message: "Please provide disaster type and location!", severity: "error" };
            setSnackMessage(message);
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (selectedInputReport.disasterRequests.length != 0) {
                const resultVerify = await setVerifyRequests(selectedInputReport.disasterRequests);
                console.log("Request verify result: ", resultVerify);
            }
            const result = await editReport(selectedInputReport);
            console.log("Submit form result: ", result);
            setOpen(true);
            navigate('/controller/status');
        } catch (error) {
            console.log(error);
        }
    };

    const changeSelected = (report) => {
        setSelectedReport(report);
        setSelectedInputReport(reports.find(dReport => dReport.reportID == report.reportID));
    }

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const currentReports = await getCurrentReports();
                const newDataArray = currentReports.map((dr) => ({
                    reportID: dr.reportID,
                    reportName: `${dr.disasterType} - ${dr.disasterLocation} - ${dr.createdDate}`,
                }));
                setReports(currentReports);
                setNewReports(newDataArray);

            } catch (error) {
                console.log("Reports fecth error", error);
            }
        }
        fetchReports();
    }, []);

    useEffect(() => {
        if (reports) {
            console.log("Reports for edit: ", reports);
        }
    }, [reports])

    useEffect(() => {
        if (selectedInputReport) {
            console.log("Report to edit: ", selectedInputReport);
            setNumOfRequests(selectedInputReport.disasterRequests.length)
        }
    }, [selectedInputReport])

    return (
        <div className="flex flex-col">
            <LanguageBar />
            {
                <HeaderBar />
            }
            <div className="flex w-full justify-center bg-grey mb-2">
                <span className="flex py-1 justify-center text-[25px] font-bold font-Inter">Disaster Status</span>
            </div>
            <div className="flex flex-col bg-menuBlue py-2 justify-center items-center">
                <div className="flex flex-row justify-center items-center space-x-5 bg-white p-2 rounded mb-2 w-full">
                    <div className="text-black font-bold">Select Disaster Report to edit</div>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={newReports}
                        getOptionLabel={(disasterReport) => disasterReport.reportName}
                        sx={{ width: 400 }}
                        renderInput={(params) => <TextField {...params} label="Disaster Report" />}
                        value={selectedReport}
                        onChange={(event, newValue) => {
                            changeSelected(newValue);
                        }}
                    />
                </div>
                {
                    selectedInputReport &&
                    <div className="flex-col items-center justify-center bg-white space-y-1 px-3 rounded-md">
                        <div className="flex text-[30px] text-white font-bold justify-center bg-reportTitleBg rounded-b-md shadow">Disaster Report</div>
                        <form onSubmit={onSubmitForm} className="p-2">
                            <div className="flex flex-col space-y-5">
                                <div className="grid grid-cols-2 gap-4 bg-grey p-2 rounded">
                                    <div className="flex flex-col space-y-3 bg-white p-1">
                                        <div className="flex justify-center bg-grey text-center text-[20px] font-bold shadow">
                                            Disaster Details
                                        </div>
                                        <div className="flex font-bold">Disaster Type : </div>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="disasterType"
                                            value={selectedInputReport.disasterType}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        >
                                            <option value="">Select Disaster Type</option>
                                            <option value="Flood">Flood</option>
                                            <option value="Tsunami">Tsunami</option>
                                            <option value="Extreme Wind">Extreme Wind</option>
                                            <option value="Drought">Drought</option>
                                            <option value="Extreme Wind">Extreme Wind</option>
                                            <option value="Earthquake">Earthquake</option>
                                        </select>

                                        <div className="flex font-bold">Severity</div>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="severity"
                                            value={selectedInputReport.severity}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Severity</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                        <div className="flex font-bold">Disaster Locations</div>
                                        <input type="text" name="disasterLocation"
                                            value={selectedInputReport.disasterLocation}
                                            onChange={handleChange} required disabled />

                                        <div className="flex font-bold">Disaster Confirmation : </div>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="confirmed"
                                            value={selectedInputReport.confirmed}
                                            onChange={handleChange}
                                            required
                                            disabled={selectedInputReport.confirmed ?? true}
                                        >
                                            <option value="">Select status</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <div className="flex flex-col space-y-3 bg-white p-1">
                                            <div className="flex justify-center bg-grey text-center text-[20px] font-bold shadow">
                                                Affected Details
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 items-center">
                                                <div className="flex font-bold justify-center">Affected Count</div>
                                                <input className="" type="number" name="affectedCount"
                                                    value={selectedInputReport.affectedCount}
                                                    onChange={handleChange} required />
                                                <div className="flex font-bold justify-center">Total Requests</div>
                                                <div className="flex text-[18px] text-white font-bold bg-langGrey justify-center rounded">{numOfRequests}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 bg-white p-1">
                                            <div className="flex justify-center bg-grey text-center text-[20px] font-bold shadow">
                                                Report Details
                                            </div>
                                            <div className="grid grid-col-2">
                                                <div className="flex font-bold">Created Date</div>
                                                <input type="text" name="createdDate" value={selectedInputReport.createdDate} readOnly />
                                                <div className="flex font-bold">Last Updated</div>
                                                <input type="text" name="updatedDate" value={selectedInputReport.updatedDate} readOnly />
                                                <div className="flex font-bold">Finished</div>
                                                <select
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="finished"
                                                    value={selectedInputReport.finished}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center space-x-5">
                                    <LoadingButton
                                        size="small"
                                        onClick={handleRequests}
                                        endIcon={<SyncAltIcon />}
                                        loading={sync}
                                        loadingPosition="end"
                                        variant="contained"
                                    > <span>Sync Requests</span></LoadingButton>
                                    <Button variant="contained"
                                        onClick={onSubmitForm}>
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            open={open}
                            onClose={handleClose}
                            autoHideDuration={1800}
                        >
                            <Alert
                                onClose={handleClose}
                                severity={snackMessage.severity}
                                variant="filled"
                                sx={{ width: '100%' }}
                            >{snackMessage.message}
                            </Alert>
                        </Snackbar>
                    </div>
                }
            </div>
        </div>
    )
}