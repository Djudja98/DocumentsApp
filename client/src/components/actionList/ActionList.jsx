import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';

import * as api from '../../api';

const ActionList = () => {

    const columns = [
        {
          field: 'username',
          headerName: 'Username',
          width: 150,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
        },
        {
          field: 'directory',
          headerName: 'Directory',
          width: 300,
        },
        {
          field: 'time',
          headerName: 'Time',
          width: 250,
        },
    ];

    const [data, setData] = useState([]);

    useEffect(()=>{
        const getActions = async () =>{
          try{
            const res = await api.getActions();
            setData(res.data);
          }catch(error){
            console.log(error.message);
          }
        };
        getActions();
        {document.body.style.zoom = "90%"}
        console.log(data);
      },[])

    return (
        <>
        <div>
            <Link to="/users">
                Users
            </Link>
        </div>
        <div style={{ height: 750, width: '100%' }} className="actionList">
        <DataGrid
        rows={data.map( item => ({id: item._id, username: item.username, action: item.type, directory: item.documentName, time: item.date}))}
        columns={columns}
        pageSize={10}
        rowsPerPage={10}
        disableSelectionOnClick
        />
        </div>
        </>
    );
}
 
export default ActionList;