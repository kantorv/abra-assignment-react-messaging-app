import   {useEffect, useState} from 'react';

import { Toolbar , Box, Typography, IconButton} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';
import type { GridRowParams,MuiEvent, GridCallbackDetails , GridRowSelectionModel } from '@mui/x-data-grid'; 
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useActor, useSelector } from '@xstate/react';
import { useApiService } from '.';
import DeleteMessagesConfirmationDialog from './DeleteMessagesConfirmationDialog'


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

   const apiRef = useGridApiRef();

  const navigate = useNavigate()
  const onRowClick = (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails)=>{
    const {id} = params
    navigate(`/messages/${id}`)
  }

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    

  const {apiService} = useApiService()

  const received_messages = useSelector(apiService, (state)=>state.context.received_messages)
  


  useEffect(()=>{
    console.log("rowSelectionModel update", rowSelectionModel)
  },[rowSelectionModel])


  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false)
  const openDeleteConfirmationDialogFn = ()=>setShowDeleteConfirmationDialog(true)
  const closeDeleteConfirmationDialogFn = ()=>setShowDeleteConfirmationDialog(false)
  const confirmDeleteFn = ()=>apiService.send({
    type: 'EVENTS.API.DELETE_RECIEVED_MESSAGES',
    ids: rowSelectionModel as string[]
  })


  useEffect(()=>{
    closeDeleteConfirmationDialogFn()
  },[received_messages])

  return (
    <Box sx={{   maxWidth: '100%' }}>

        <DeleteMessagesConfirmationDialog  
            open={showDeleteConfirmationDialog}
            closeFn={closeDeleteConfirmationDialogFn}
            message={`${rowSelectionModel.length} message${rowSelectionModel.length >1?`s`:``} will be deleted!`}
            confirmFn={confirmDeleteFn}
            
        />


      <Toolbar
        sx={{
          background:"azure",
          display: "flex",
          alignItems:"center",

        }}
      >
        <Typography paragraph>Inbox</Typography>
        <div style={{ flexGrow:1 }}></div>
        {
          rowSelectionModel.length > 0?
          <Box sx={{
            display:"flex"
          }}>
            <Typography paragraph>{rowSelectionModel.length } message{rowSelectionModel.length >1?`s`:``} selected</Typography>
            <IconButton aria-label="delete" onClick={openDeleteConfirmationDialogFn}>
                    <DeleteIcon  sx={{position: "relative", bottom: 8}}/>
            </IconButton>
          </Box>:null
        }

      </Toolbar>
      <DataGrid
        apiRef={apiRef}
        rows={received_messages}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
    //    autoHeight
        pageSizeOptions={[5,25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSelector


        onCellClick={()=>false}
        onRowClick ={onRowClick}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}

     //   keepNonExistentRowsSelected
    //    showCellVerticalBorder={false}
     //   showColumnVerticalBorder={false }
       hideFooterSelectedRowCount
      />
    </Box>
  );
}
