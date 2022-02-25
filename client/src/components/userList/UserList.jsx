import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import {DeleteOutline} from '@material-ui/icons';

import "./userList.css"
import * as api from '../../api';
import PopupEdit from '../Popup/PopupEdit';
import AddUserForm from './AddUserForm';
import EditUserForm from './EditUserForm';

const initialValues = {
  username: '',
  password: '',
  accountType: 0,
  myDirectory : '/root',
  allowedIp: '0.0.0.0',
  readAction: '',
  createAction: '',
  updateAction: '',
  deleteAction: '',
}

const UserList = () => {
    const columns = [
      {
        field: 'username',
        headerName: 'Username',
        width: 150,
      },
      {
        field: 'accountType',
        headerName: 'Account Type',
        width: 180,
        renderCell: (cellValues) => {
          if(cellValues.row.accountType === 0){
            return "Admin Sistema";
          }
          else if(cellValues.row.accountType === 1){
            return "Admin dokumenata";
          }
          else{
            return "Klijent";
          }
        }
      },
      {
        field: 'directory',
        headerName: 'Directory',
        width: 200,
      },
      {
        field: 'allowedIp',
        headerName: 'Allowed IP',
        width: 150,
      },
      {
        field: 'readAction',
        headerName: 'Read Action',
        width: 180,
        renderCell: (cellValues) => {
          return cellValues.row.readAction? <span className="greenDot"></span> : <span className="redDot"></span>
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
        field: 'actionEdit',
        headerName: 'Edit',
        width: 120,
        renderCell: (params) =>{
            return(
                <button className="editButton"
                onClick={()=> prepareEdit(params.row.id)}>
                Edit</button>
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
                onClick={()=> handleDelete(params.row.id)} />
            )
        }
      },
    ];

      //USE STATE
      const [data, setData] = useState([]);
      const [openPopup, setOpenPopup] = useState(false);
      const [editPopup, setEditPopup] = useState(false);
      const [userInfoEdit, setUserInfoEdit] = useState(initialValues);
      const [userInfoAdd, setUserInfoAdd] = useState(initialValues);

      const navigate = useNavigate();


      useEffect(()=>{
        const getUsers = async () =>{
          try{
            const res = await api.getUsers();
            setData(res.data);
          }catch(error){
            console.log(error.message);
          }
        };
        getUsers();
        {document.body.style.zoom = "90%"}
      },[])

    const handleAddUser = async (values) =>{
        try{
            await api.createUser(values);
        }catch(error){
          console.log(error);
        }
        setOpenPopup(false);
        window.location.reload(false);
    }

    const handleDelete = async (id) =>{
      try{
          await api.deleteUser(id);
          window.location.reload(false);
      }catch(error){
          console.log(error);
      }
    }

    const prepareEdit = (id) =>{
      const user = data.find(user => user._id === id);
      setUserInfoEdit(user);
      setEditPopup(true);
    }

    const handleEdit = async () =>{
      try{
        await api.updateUser(userInfoEdit._id, userInfoEdit);
      }catch(error){
        console.log(error);
      }
      setEditPopup(false);
      window.location.reload(false);
    }

    const handleLogout = () =>{
      navigate('/auth');
      localStorage.clear();
    }


    //kod popupa za add ostalo je ono edit u props, ne da mi se mijenjati ali da znam zasto je tu edit
    return (
        <>
        <button className="addButton" onClick={()=> setOpenPopup(true)}>
          Add user
        </button>
        <button className="logoutButton" onClick={()=> handleLogout()}>
          Logout
        </button>
        <div>
          <Link to="/actions">
            Actions
          </Link>
        </div>
        <div style={{ height: 750, width: '100%' }} className="userList">
        <DataGrid
        rows={data.map( item => ({id: item._id, username: item.username, accountType: item.accountType, 
          directory: item.myDirectory, allowedIp: item.allowedIp, readAction: item.readAction,
          createAction: item.createAction, updateAction: item.updateAction, deleteAction: item.deleteAction}))}
        columns={columns}
        pageSize={10}
        rowsPerPage={10}
        disableSelectionOnClick
        />
        </div>
        <PopupEdit openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add User">
        <AddUserForm
        editAboutMe={handleAddUser}
        userInfoEdit={userInfoAdd}
        setUserInfoEdit={setUserInfoAdd} />
        </PopupEdit>
        <PopupEdit openPopup={editPopup} setOpenPopup={setEditPopup} title="Edit User">
        <EditUserForm 
        editAboutMe={handleEdit}
        userInfoEdit={userInfoEdit}
        setUserInfoEdit={setUserInfoEdit} />
        </PopupEdit>
        </>
    );
}
 
export default UserList;