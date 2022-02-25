import {useState ,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import {DeleteOutline} from '@material-ui/icons';
import FileBase from 'react-file-base64';
import * as api from '../../api';
import "./fileList.css"

import PopupEdit from '../Popup/PopupEdit';
import InputField from './InputField';

import axios from 'axios';


const FileList = () => {

    const user = JSON.parse(localStorage.getItem('profile'));

    const columns = [
        {
          field: 'directory',
          headerName: 'Directory',
          width: 450,
        },
        {
          field: 'downloadAction',
          headerName: 'Download Action',
          width: 200,
          renderCell: (cellValues) => {
            return cellValues.row.downloadAction? <span className="greenDot"></span> : <span className="redDot"></span>
          }
        },
        {
          field: 'createAction',
          headerName: 'Create Action',
          width: 180,
          renderCell: (cellValues) => {
            return cellValues.row.createAction? <span className="greenDot"></span> : <span className="redDot"></span>
          }
        },
        {
          field: 'updateAction',
          headerName: 'Update Action',
          width: 180,
          renderCell: (cellValues) => {
            return cellValues.row.updateAction? <span className="greenDot"></span> : <span className="redDot"></span>
          }
        },
        {
          field: 'deleteAction',
          headerName: 'Delete Action',
          width: 180,
          renderCell: (cellValues) => {
            return cellValues.row.deleteAction? <span className="greenDot"></span> : <span className="redDot"></span>
          }
        },
        {
          field: 'actionDownload',
          headerName: 'Download',
          width: 150,
          renderCell: (params) =>{
              return(
                  <button className="editButton"
                  onClick={()=> handleDownload(params.row.directory)}>
                  Download</button>
              )
          }
        },
        {
          field: 'actionDelete',
          headerName: 'Delete',
          width: 120,
          renderCell: (params) =>{
              return(
                  <DeleteOutline className="deleteButton"
                  onClick={()=> handleDelete(params.row.directory)} />
              )
          }
        },
        {
          field: 'actionMove',
          headerName: 'Move',
          width: 130,
          renderCell: (params) =>{
              return(
                  (user?.result?.accountType === 1) && <button className="editButton"
                  onClick={()=> handleMove(params.row.directory)}>
                  Move</button>
              )
          }
        },
    ];

    // ovo su samo nazivi fajlova koji stizu sa servera
    const [files, setFiles] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [openPopup1, setOpenPopup1] = useState(false);
    const [openPopup2, setOpenPopup2] = useState(false);

    //za dir
    const [createDirLocation, setCreateDirLocation] = useState("root");
    const [deleteDirLocation, setDeleteDirLocation] = useState("root");

    //za move
    const [fileSource, setFileSource] = useState("");
    const [fileDestination, setFileDestination] = useState("root");

    const navigate = useNavigate();

    useEffect(()=>{
        const getFiles = async () =>{
            try{
                const res = await api.getUserFiles();
                setFiles(res.data);
            }catch(error){
                console.log(error.message);
            } 
        };
        getFiles();
        {document.body.style.zoom = "90%"} 
    },[]);

    const handleLogout = () =>{
        navigate('/auth');
        localStorage.clear();
    }

    const handleDelete = async (directory) =>{
      try{
        await api.deleteFile(directory);

        const date = new Date().toISOString();
        const action = {type: "DELETE", username: user.result?.username, documentName: directory, date: date };
        await api.createAction(action);
      }catch(error){
        console.log(error.message)
      }
      window.location.reload(false);
    }

    const handleMove = (path) =>{
      setFileSource(path);
      setOpenPopup(true);
    }

    const sendMoveRequest = async (value) =>{
      const data = {source: fileSource,
        destination: value};
        try{
          await api.moveFile(data);
        }catch(error){
          console.log(error.message);
        }
      setOpenPopup(false);
      window.location.reload(false);
    }

    //radi, ne dirati vise, ZA GUGL AUTH falice token, fali kreiranje akcije za admina
    const handleDownload = async (params) => {
      const arrayTmp = params.split("/");
      const fileName = arrayTmp[arrayTmp.length -1];

      axios({
        url : `https://localhost:5000/files/download?dir=${params}`,
        method: 'GET',
        responseType: 'blob',
        headers: {'Authorization': `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`},
      }).then((response) =>{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      }).catch(error => console.log(error.message));

      try{
        const date = new Date().toISOString();
        const action = {type: "DOWNLOAD", username: user.result?.username, documentName: params, date: date };
        await api.createAction(action);
      }catch(error){
        console.log(error.message);
      }
    }

    const handleUploadFile = async (name, base64) =>{
      try{
        console.log(base64);
        await api.uploadFile({fileName:name, file:base64});

        const date = new Date().toISOString();
        const directoryName = user.result?.myDirectory + "/" + name;
        const action = {type: "UPLOAD", username: user.result?.username, documentName: directoryName, date: date };
        await api.createAction(action);
      }catch(error){
        console.log(error.message);
      }
      window.location.reload(false);
    }

    const handleDeleteDir = async (value) =>{
      const data = {source: value};
        try{
          await api.deleteDir(data);
        }catch(error){
          console.log(error.message);
        }
      setOpenPopup2(false);
    }

    const handleCreateDir = async (value) =>{
      const data = {source: value};
        try{
          await api.createDir(data);
          const date = new Date().toISOString();
          const action = {type: "UPLOAD", username: user.result?.username, documentName: value, date: date };
          await api.createAction(action);
        }catch(error){
          console.log(error.message);
        }
      setOpenPopup1(false);
    }


    return (
        <>
        <div>
            <h5>Select file for upload</h5>
            {(user?.result?.accountType>-1 && user?.result?.accountType<3) && <FileBase 
                    type="file"
                    multiple={false}
                    onDone={({name, base64}) => handleUploadFile(name,base64)}
            />}
            <button className="logoutButton" onClick={()=> handleLogout()}>
            Logout
            </button>
        </div>
        <div>
          {(user?.result?.accountType === 1) && <button className="createDirButton" onClick={() => setOpenPopup1(true)}>
            Create Dir
          </button>}
          {(user?.result?.accountType === 1) && <button onClick={() => setOpenPopup2(true)}>
            Delete Dir
          </button>}
        </div>
        <div style={{ height: 750, width: '100%' }} className="userList">
        <DataGrid
        rows={files.map( item => ({id: Math.floor(Math.random() * 10000), directory: item,
        downloadAction: user.result.readAction, createAction: user.result.createAction, updateAction: user.result.updateAction, deleteAction: user.result.deleteAction}))}
        columns={columns}
        pageSize={10}
        rowsPerPage={10}
        disableSelectionOnClick
        />
        </div>
        <PopupEdit openPopup={openPopup} setOpenPopup={setOpenPopup} title="Select directory">
          <InputField
          editAboutMe={sendMoveRequest}
          input={fileDestination}
          setInput={setFileDestination} />
        </PopupEdit>
        <PopupEdit openPopup={openPopup1} setOpenPopup={setOpenPopup1} title="Select directory">
          <InputField 
          editAboutMe={handleCreateDir}
          input={createDirLocation}
          setInput={setCreateDirLocation} />
        </PopupEdit>
        <PopupEdit openPopup={openPopup2} setOpenPopup={setOpenPopup2} title="Select directory">
          <InputField 
          editAboutMe={handleDeleteDir}
          input={deleteDirLocation}
          setInput={setDeleteDirLocation} />
        </PopupEdit>
        </>
    );
}
 
export default FileList;