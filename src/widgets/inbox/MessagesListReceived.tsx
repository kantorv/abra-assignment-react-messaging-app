import   {useEffect} from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import type { GridRowParams,MuiEvent, GridCallbackDetails  } from '@mui/x-data-grid'; 
import { useNavigate } from 'react-router-dom';

import { useActor, useSelector } from '@xstate/react';
import { useApiService } from '.';
const columns: GridColDef[] = [
  {
    field: 'from',
    headerName: 'From',
    width: 150,
    editable: false,
    sortable: false
  },
  {
    field: 'subject',
    headerName: 'Subject',
    minWidth: 150,
    flex: 1,
    editable: false,
    sortable: false,
    
    // valueGetter: (params: GridValueGetterParams) =>
    // `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },

  {
    field: 'created',
    headerName: 'Created',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: 160,

  },
];


export default function DataGridDemo() {

  const navigate = useNavigate()
  const onRowClick = (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails)=>{
    const {id} = params
    navigate(`/messages/${id}`)
  }

  const {apiService} = useApiService()

  const received_messages = useSelector(apiService, (state)=>state.context.received_messages)
  
  useEffect(()=>{
    if(received_messages.length === 0){
      apiService.send('EVENTS.API.LOAD_RECEIVED_MESSAGES')
    }
  },[])





  return (
    <Box sx={{   width: '100%' }}>
      <DataGrid
        rows={received_messages}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5,25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSelector


        onCellClick={()=>false}
        onRowClick ={onRowClick}
      />
    </Box>
  );
}
